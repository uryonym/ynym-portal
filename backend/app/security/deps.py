"""認証依存性."""

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status

from app.core.db import SessionDep
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.security.jwt import TokenValidationError, decode_access_token
from app.services.user_service import UserService

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    request: Request,
    db: SessionDep,
) -> User:
    """HttpOnly クッキーから JWT を検証し、現在のユーザーを返す."""
    token = request.cookies.get("access_token")
    if token is None:
        raise credentials_exception

    try:
        payload = decode_access_token(token)
    except TokenValidationError as e:
        raise credentials_exception from e

    email: str | None = payload.get("sub")
    if email is None:
        raise credentials_exception

    user_service = UserService(UserRepository(db))
    user = user_service.get_by_email(email=email, include_deleted=False)
    if user is None or user.deleted_at is not None:
        raise credentials_exception

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_admin_user(
    current_user: CurrentUser,
) -> User:
    """管理者権限を持つユーザーのみアクセスを許可."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="管理者権限が必要です。",
        )
    return current_user


CurrentAdminUser = Annotated[User, Depends(get_current_admin_user)]
