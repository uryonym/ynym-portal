"""トランザクション境界とロールバックの統合テスト."""

from uuid import UUID

import pytest
from fastapi import APIRouter, HTTPException, status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.db import SessionDep, get_db, transactional_session
from app.main import app
from app.models.note import Note
from app.models.note_category import NoteCategory
from app.models.task import Task
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.task_repository import TaskRepository

TEST_USER_ID = UUID("550e8400-e29b-41d4-a716-446655440000")


class TestRepositoryTransactionIndependence:
    """BaseRepository が commit 責務を持たずデータアクセスに専念していることの検証."""

    def test_save_does_not_commit_automatically(self, db_session: Session) -> None:
        """repo.save() は flush するが commit はしないため、rollback すると取り消される."""
        repo = TaskRepository(db_session)
        task = Task(
            user_id=TEST_USER_ID,
            title="未コミットタスク",
            description="セッションロールバックで消えること",
        )
        saved = repo.save(task)
        assert saved.id is not None  # flush により ID は生成されている

        # commit せずに rollback を実行
        db_session.rollback()

        # ロールバックされたため、DB 上に存在しないことを確認
        assert repo.get_by_id(saved.id) is None

    def test_delete_does_not_commit_automatically(self, db_session: Session) -> None:
        """repo.delete() は flush するが commit はしないため、rollback すると復元される."""
        repo = TaskRepository(db_session)
        task = Task(user_id=TEST_USER_ID, title="削除テストタスク")
        repo.save(task)
        db_session.commit()  # 作成を確定

        # 削除を実行
        repo.delete(task)
        assert repo.get_by_id(task.id) is None

        # commit せずに rollback
        db_session.rollback()

        # ロールバックにより削除が取り消され、再度取得できることを確認
        restored = repo.get_by_id(task.id)
        assert restored is not None
        assert restored.title == "削除テストタスク"


class TestTransactionalSessionContextManager:
    """transactional_session コンテキストマネージャの動作検証."""

    def test_transactional_session_commits_on_success(self) -> None:
        """正常終了時に自動 commit される."""
        task_id = None
        with transactional_session() as session:
            repo = TaskRepository(session)
            task = Task(user_id=TEST_USER_ID, title="コンテキストマネージャ正常コミット")
            repo.save(task)
            task_id = task.id

        assert task_id is not None

        # 別のセッションで永続化されていることを確認
        with transactional_session() as session:
            repo = TaskRepository(session)
            found = repo.get_by_id(task_id)
            assert found is not None
            assert found.title == "コンテキストマネージャ正常コミット"
            # テストデータクリーンアップ
            repo.delete(found)

    def test_transactional_session_rollbacks_on_exception(self) -> None:
        """例外発生時に自動 rollback され、データが残らない."""
        task_id = None
        with pytest.raises(ValueError, match="意図的なエラー"):
            with transactional_session() as session:
                repo = TaskRepository(session)
                task = Task(
                    user_id=TEST_USER_ID, title="コンテキストマネージャロールバック"
                )
                repo.save(task)
                task_id = task.id
                raise ValueError("意図的なエラー")

        assert task_id is not None

        # 別のセッションで確認し、ロールバックされて存在しないことを確認
        with transactional_session() as session:
            repo = TaskRepository(session)
            assert repo.get_by_id(task_id) is None


class TestFastAPIRequestTransactionBoundary:
    """FastAPI の get_db によるリクエスト単位のトランザクション境界の検証."""

    def test_multiple_operations_atomic_rollback_on_error(
        self, client: TestClient, db_session: Session
    ) -> None:
        """複数リポジトリ操作中に例外が発生した場合、先行操作も含めてアトミックにロールバックされる."""
        test_router = APIRouter()

        @test_router.post("/test-tx-failure")
        def endpoint_with_failure(db: SessionDep) -> dict:
            # 1. カテゴリを作成
            cat_repo = NoteCategoryRepository(db)
            category = NoteCategory(user_id=TEST_USER_ID, name="ロールバック対象カテゴリ")
            cat_repo.save(category)

            # 2. ノートを作成
            note_repo = NoteRepository(db)
            note = Note(
                user_id=TEST_USER_ID,
                title="ロールバック対象ノート",
                body="ロールバック対象の本文",
                category_id=category.id,
            )
            note_repo.save(note)

            # 3. 意図的に例外を発生させる
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="途中でエラーが発生しました",
            )

        app.include_router(test_router)

        try:
            response = client.post("/test-tx-failure")
            assert response.status_code == 500

            # エラーによりロールバックされているため、カテゴリもノートも保存されていないことを確認
            cat_repo = NoteCategoryRepository(db_session)
            cats = cat_repo.list_by_user(TEST_USER_ID)
            assert not any(c.name == "ロールバック対象カテゴリ" for c in cats)

            note_repo = NoteRepository(db_session)
            notes = note_repo.list_by_user(TEST_USER_ID)
            assert not any(n.title == "ロールバック対象ノート" for n in notes)
        finally:
            # テスト用ルートをクリーンアップ
            app.routes[:] = [
                r for r in app.routes if getattr(r, "path", None) != "/test-tx-failure"
            ]

    def test_get_db_generator_lifecycle(self) -> None:
        """get_db() ジェネレータが正常時に commit、例外時に rollback を呼ぶことを直接検証."""
        from unittest.mock import MagicMock, patch

        mock_session = MagicMock(spec=Session)

        with patch("app.core.db.session_local", return_value=mock_session):
            # 正常終了ケース
            gen = get_db()
            sess = next(gen)
            assert sess is mock_session
            try:
                next(gen)
            except StopIteration:
                pass
            mock_session.commit.assert_called_once()
            mock_session.close.assert_called_once()

        mock_session.reset_mock()

        with patch("app.core.db.session_local", return_value=mock_session):
            # 例外発生ケース
            gen = get_db()
            sess = next(gen)
            assert sess is mock_session
            with pytest.raises(RuntimeError):
                gen.throw(RuntimeError("エラー"))
            mock_session.rollback.assert_called_once()
            mock_session.close.assert_called_once()
