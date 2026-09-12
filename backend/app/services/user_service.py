"""ユーザー管理サービス."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import HTTPException, status

from app.models.base import JST
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    """ユーザー管理ビジネスロジック層."""

    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    def get_by_id(self, user_id: UUID, include_deleted: bool = False) -> User | None:
        """ID でユーザーを取得."""
        return self.user_repo.get_by_id(user_id, include_deleted=include_deleted)

    def get_by_email(self, email: str, include_deleted: bool = False) -> User | None:
        """メールアドレスでユーザーを取得."""
        return self.user_repo.get_by_email(email, include_deleted=include_deleted)

    def get_by_google_uid(
        self, google_uid: str, include_deleted: bool = False
    ) -> User | None:
        """Google UID でユーザーを取得."""
        return self.user_repo.get_by_google_uid(
            google_uid, include_deleted=include_deleted
        )

    def list_users(
        self,
        skip: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
        search: str | None = None,
    ) -> list[User]:
        """ユーザー一覧を取得."""
        return self.user_repo.list_users(
            skip=skip, limit=limit, include_deleted=include_deleted, search=search
        )

    def count_users(
        self,
        include_deleted: bool = False,
        search: str | None = None,
    ) -> int:
        """ユーザー総数を取得."""
        return self.user_repo.count_users(
            include_deleted=include_deleted, search=search
        )

    def create_user(self, user_in: UserCreate) -> User:
        """事前登録用: 新規ユーザーを作成."""
        existing_uid = self.user_repo.get_by_google_uid(
            user_in.google_uid, include_deleted=True
        )
        if existing_uid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このGoogle UIDは既に登録されています。",
            )

        existing_email = self.user_repo.get_by_email(
            user_in.email, include_deleted=True
        )
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="このメールアドレスは既に登録されています。",
            )

        user = User(
            google_uid=user_in.google_uid,
            email=user_in.email,
            name=user_in.name,
            is_admin=user_in.is_admin,
        )
        return self.user_repo.save(user)

    def update_user(self, user_id: UUID, user_in: UserUpdate) -> User:
        """ユーザー情報を更新."""
        user = self.user_repo.get_by_id(user_id, include_deleted=True)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ユーザーが見つかりません。",
            )

        if user_in.google_uid and user_in.google_uid != user.google_uid:
            existing_uid = self.user_repo.get_by_google_uid(
                user_in.google_uid, include_deleted=True
            )
            if existing_uid and existing_uid.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="このGoogle UIDは既に使用されています。",
                )
            user.google_uid = user_in.google_uid

        if user_in.email and user_in.email != user.email:
            existing_email = self.user_repo.get_by_email(
                user_in.email, include_deleted=True
            )
            if existing_email and existing_email.id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="このメールアドレスは既に使用されています。",
                )
            user.email = user_in.email

        if user_in.name is not None:
            user.name = user_in.name

        if user_in.is_admin is not None:
            user.is_admin = user_in.is_admin

        return self.user_repo.save(user)

    def delete_user(self, user_id: UUID) -> User:
        """ユーザーを論理削除（退会扱い）."""
        user = self.user_repo.get_by_id(user_id, include_deleted=True)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ユーザーが見つかりません。",
            )
        if user.deleted_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ユーザーは既に削除されています。",
            )

        user.deleted_at = datetime.now(JST)
        return self.user_repo.save(user)

    def restore_user(self, user_id: UUID) -> User:
        """論理削除されたユーザーを復元（再有効化）."""
        user = self.user_repo.get_by_id(user_id, include_deleted=True)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ユーザーが見つかりません。",
            )
        if user.deleted_at is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ユーザーは削除されていません。",
            )

        user.deleted_at = None
        return self.user_repo.save(user)

    def sync_google_user(
        self,
        user: User,
        name: str,
        email: str,
        avatar_url: str | None,
    ) -> User:
        """Google OAuth 認証時のプロファイル同期."""
        user.name = name
        user.email = email
        if avatar_url:
            user.avatar_url = avatar_url
        return self.user_repo.save(user)
