"""ノートカテゴリリポジトリ."""

from uuid import UUID

from sqlalchemy import asc, select

from app.models.note_category import NoteCategory
from app.repositories.base import UserOwnedSoftDeleteRepository


class NoteCategoryRepository(UserOwnedSoftDeleteRepository[NoteCategory]):
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
