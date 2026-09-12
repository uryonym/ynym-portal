"""ユーザー関連エンドポイント."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.core.db import SessionDep
from app.repositories.user_repository import UserRepository
from app.schemas.base import SuccessResponse
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.security.deps import CurrentAdminUser, CurrentUser
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


def _get_user_service(db: SessionDep) -> UserService:
    return UserService(UserRepository(db))


@router.get("/me", response_model=UserResponse)
def get_current_user_me(
    current_user: CurrentUser,
) -> UserResponse:
    """現在のログインユーザー情報を取得."""
    return UserResponse.model_validate(current_user)


@router.get("", response_model=SuccessResponse[list[UserResponse]])
def list_users(
    _: CurrentAdminUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    include_deleted: bool = Query(False),
    search: str | None = Query(None),
    service: UserService = Depends(_get_user_service),
) -> dict:
    """ユーザー一覧を取得（管理者専用）."""
    users = service.list_users(
        skip=skip,
        limit=limit,
        include_deleted=include_deleted,
        search=search,
    )
    return {
        "data": [UserResponse.model_validate(u) for u in users],
        "message": "ユーザー一覧を取得しました",
    }


@router.post(
    "",
    response_model=SuccessResponse[UserResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    _: CurrentAdminUser,
    payload: UserCreate,
    service: UserService = Depends(_get_user_service),
) -> dict:
    """新規ユーザーを事前登録（管理者専用）."""
    created_user = service.create_user(payload)
    return {
        "data": UserResponse.model_validate(created_user),
        "message": "ユーザーが登録されました",
    }


@router.get("/{user_id}", response_model=SuccessResponse[UserResponse])
def get_user(
    _: CurrentAdminUser,
    user_id: UUID,
    service: UserService = Depends(_get_user_service),
) -> dict:
    """ユーザー詳細を取得（管理者専用）."""
    user = service.get_by_id(user_id, include_deleted=True)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ユーザーが見つかりません。",
        )
    return {
        "data": UserResponse.model_validate(user),
        "message": "ユーザー情報を取得しました",
    }


@router.put("/{user_id}", response_model=SuccessResponse[UserResponse])
def update_user(
    _: CurrentAdminUser,
    user_id: UUID,
    payload: UserUpdate,
    service: UserService = Depends(_get_user_service),
) -> dict:
    """ユーザー情報を更新（管理者専用）."""
    updated_user = service.update_user(user_id, payload)
    return {
        "data": UserResponse.model_validate(updated_user),
        "message": "ユーザー情報が更新されました",
    }


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    current_admin: CurrentAdminUser,
    user_id: UUID,
    service: UserService = Depends(_get_user_service),
) -> Response:
    """ユーザーを論理削除（管理者専用・退会扱い）."""
    if current_admin.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="自分自身のユーザーを削除することはできません。",
        )
    service.delete_user(user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{user_id}/restore", response_model=SuccessResponse[UserResponse])
def restore_user(
    _: CurrentAdminUser,
    user_id: UUID,
    service: UserService = Depends(_get_user_service),
) -> dict:
    """論理削除されたユーザーを復元（管理者専用）."""
    restored_user = service.restore_user(user_id)
    return {
        "data": UserResponse.model_validate(restored_user),
        "message": "ユーザーが復元されました",
    }
