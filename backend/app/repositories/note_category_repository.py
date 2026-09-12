"""ノートカテゴリリポジトリ."""

from uuid import UUID

from sqlalchemy import asc, func, select

from app.models.note_category import NoteCategory
from app.repositories.base import BaseRepository


class NoteCategoryRepository(BaseRepository[NoteCategory]):
    """ノートカテゴリに関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, NoteCategory)

    def list_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[NoteCategory]:
        """ユーザーのカテゴリ一覧を名前昇順で取得."""
        stmt = (
            select(NoteCategory)
            .where(
                NoteCategory.user_id == user_id,
                NoteCategory.deleted_at.is_(None),
            )
            .order_by(asc(NoteCategory.name))
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def get_by_id_and_user(
        self, category_id: UUID, user_id: UUID
    ) -> NoteCategory | None:
        """category_id と user_id でカテゴリを取得（所有権確認）."""
        stmt = select(NoteCategory).where(
            NoteCategory.id == category_id,
            NoteCategory.user_id == user_id,
            NoteCategory.deleted_at.is_(None),
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def list_deleted_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[NoteCategory]:
        """論理削除されたカテゴリ一覧を取得（削除日時降順）."""
        stmt = (
            select(NoteCategory)
            .where(
                NoteCategory.user_id == user_id,
                NoteCategory.deleted_at.is_not(None),
            )
            .order_by(NoteCategory.deleted_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_deleted_by_user(self, user_id: UUID) -> int:
        """論理削除されたカテゴリの総件数を取得."""
        stmt = (
            select(func.count())
            .select_from(NoteCategory)
            .where(
                NoteCategory.user_id == user_id,
                NoteCategory.deleted_at.is_not(None),
            )
        )
        return self.session.execute(stmt).scalar() or 0

    def get_deleted_by_id_and_user(
        self, category_id: UUID, user_id: UUID
    ) -> NoteCategory | None:
        """category_id と user_id で論理削除されたカテゴリを取得."""
        stmt = select(NoteCategory).where(
            NoteCategory.id == category_id,
            NoteCategory.user_id == user_id,
            NoteCategory.deleted_at.is_not(None),
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def get_by_id_including_deleted(
        self, category_id: UUID, user_id: UUID
    ) -> NoteCategory | None:
        """削除状態に関わらず category_id と user_id でカテゴリを取得."""
        stmt = select(NoteCategory).where(
            NoteCategory.id == category_id,
            NoteCategory.user_id == user_id,
        )
        return self.session.execute(stmt).scalars().one_or_none()
