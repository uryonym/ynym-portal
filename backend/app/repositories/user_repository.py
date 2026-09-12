"""ユーザーリポジトリ."""

from uuid import UUID

from sqlalchemy import desc, func, or_, select

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """ユーザーに関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, User)

    def get_by_id(self, id: UUID, include_deleted: bool = False) -> User | None:
        """ID でユーザーを取得."""
        stmt = select(User).where(User.id == id)
        if not include_deleted:
            stmt = stmt.where(User.deleted_at.is_(None))
        return self.session.execute(stmt).scalars().one_or_none()

    def get_by_email(self, email: str, include_deleted: bool = False) -> User | None:
        """メールアドレスでユーザーを取得."""
        stmt = select(User).where(User.email == email)
        if not include_deleted:
            stmt = stmt.where(User.deleted_at.is_(None))
        return self.session.execute(stmt).scalars().one_or_none()

    def get_by_google_uid(
        self, google_uid: str, include_deleted: bool = False
    ) -> User | None:
        """Google UID でユーザーを取得."""
        stmt = select(User).where(User.google_uid == google_uid)
        if not include_deleted:
            stmt = stmt.where(User.deleted_at.is_(None))
        return self.session.execute(stmt).scalars().one_or_none()

    def list_users(
        self,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
        search: str | None = None,
    ) -> list[User]:
        """ユーザー一覧を取得."""
        stmt = select(User)
        if not include_deleted:
            stmt = stmt.where(User.deleted_at.is_(None))
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    User.name.ilike(search_pattern),
                    User.email.ilike(search_pattern),
                    User.google_uid.ilike(search_pattern),
                )
            )
        stmt = stmt.order_by(desc(User.created_at)).offset(skip).limit(limit)
        return list(self.session.execute(stmt).scalars().all())

    def count_users(
        self,
        include_deleted: bool = False,
        search: str | None = None,
    ) -> int:
        """ユーザー数を取得."""
        stmt = select(func.count(User.id))
        if not include_deleted:
            stmt = stmt.where(User.deleted_at.is_(None))
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    User.name.ilike(search_pattern),
                    User.email.ilike(search_pattern),
                    User.google_uid.ilike(search_pattern),
                )
            )
        return self.session.execute(stmt).scalar_one()
