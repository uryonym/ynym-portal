"""家族メンバー管理サービス層."""

from uuid import UUID

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.utils.exceptions import NotFoundException


class MemberService:
    """家族メンバー情報ビジネスロジック層."""

    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    def list_members(self) -> list[User]:
        """家族メンバー一覧を取得（有効な全ユーザー）."""
        return self.user_repo.list_users(skip=0, limit=1000, include_deleted=False)

    def update_my_color(self, user_id: UUID, color: str | None) -> User:
        """自分の表示色を更新."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("ユーザーが見つかりません")
        user.color = color
        return self.user_repo.save(user)
