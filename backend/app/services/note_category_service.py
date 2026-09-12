"""ノートカテゴリ管理サービス."""

from datetime import datetime
from uuid import UUID

from app.models.base import JST
from app.models.note_category import NoteCategory
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.schemas.note_category import NoteCategoryCreate, NoteCategoryUpdate
from app.utils.exceptions import ConflictException, NotFoundException


class NoteCategoryService:
    """ノートカテゴリ管理ビジネスロジック層."""

    def __init__(
        self,
        category_repo: NoteCategoryRepository,
        note_repo: NoteRepository,
    ) -> None:
        self.category_repo = category_repo
        self.note_repo = note_repo

    def list_categories(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> list[NoteCategory]:
        """カテゴリ一覧を取得."""
        return self.category_repo.list_by_user(user_id, skip, limit)

    def get_category(self, category_id: UUID, user_id: UUID) -> NoteCategory:
        """カテゴリを取得.

        Raises:
            NotFoundException: カテゴリが存在しない場合
        """
        category = self.category_repo.get_by_id_and_user(category_id, user_id)
        if not category:
            raise NotFoundException(f"カテゴリ ID {category_id} が見つかりません")
        return category

    def create_category(
        self, category_create: NoteCategoryCreate, user_id: UUID
    ) -> NoteCategory:
        """カテゴリを作成."""
        category = NoteCategory(user_id=user_id, name=category_create.name)
        return self.category_repo.save(category)

    def update_category(
        self,
        category_id: UUID,
        category_update: NoteCategoryUpdate,
        user_id: UUID,
    ) -> NoteCategory:
        """カテゴリを部分更新."""
        category = self.get_category(category_id, user_id)
        for field, value in category_update.model_dump(exclude_unset=True).items():
            setattr(category, field, value)
        return self.category_repo.save(category)

    def delete_category(self, category_id: UUID, user_id: UUID) -> None:
        """カテゴリを論理削除.

        Raises:
            NotFoundException: カテゴリが存在しない場合
            ConflictException: 有効なノートが存在する場合
        """
        category = self.get_category(category_id, user_id)
        if self.note_repo.count_by_category(user_id, category_id) > 0:
            raise ConflictException("ノートが存在するためカテゴリを削除できません")
        category.deleted_at = datetime.now(JST)
        self.category_repo.save(category)
