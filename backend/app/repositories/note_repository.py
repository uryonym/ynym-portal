"""ノートリポジトリ."""

from uuid import UUID

from sqlalchemy import asc, func, select, update
from sqlalchemy.sql import nulls_last

from app.models.note import Note
from app.models.note_category import NoteCategory
from app.repositories.base import BaseRepository


class NoteRepository(BaseRepository[Note]):
    """ノートに関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, Note)

    def list_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Note]:
        """ユーザーのノート一覧をカテゴリ名・タイトル昇順で取得."""
        stmt = (
            select(Note)
            .outerjoin(NoteCategory, Note.category_id == NoteCategory.id)
            .where(
                Note.user_id == user_id,
                Note.deleted_at.is_(None),
            )
            .order_by(
                nulls_last(asc(NoteCategory.name)),
                asc(Note.title),
            )
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def get_by_id_and_user(self, note_id: UUID, user_id: UUID) -> Note | None:
        """note_id と user_id でノートを取得（所有権確認）."""
        stmt = select(Note).where(
            Note.id == note_id,
            Note.user_id == user_id,
            Note.deleted_at.is_(None),
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def nullify_category(self, user_id: UUID, category_id: UUID) -> None:
        """指定カテゴリに属するノートのカテゴリを NULL に更新（コミットなし）."""
        stmt = (
            update(Note)
            .where(Note.user_id == user_id)
            .where(Note.category_id == category_id)
            .values(category_id=None)
        )
        self.session.execute(stmt)

    def count_by_category(self, user_id: UUID, category_id: UUID) -> int:
        """指定カテゴリに属する有効なノート件数を取得."""
        stmt = (
            select(func.count())
            .select_from(Note)
            .where(
                Note.user_id == user_id,
                Note.category_id == category_id,
                Note.deleted_at.is_(None),
            )
        )
        return self.session.execute(stmt).scalar() or 0
