"""ノートカテゴリ関連エンドポイント."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.schemas.base import SuccessResponse
from app.schemas.note_category import (
    NoteCategoryCreate,
    NoteCategoryResponse,
    NoteCategoryUpdate,
)
from app.security.deps import CurrentUser
from app.services.note_category_service import NoteCategoryService

router = APIRouter(prefix="/note-categories", tags=["note-categories"])


def _get_note_category_service(db: SessionDep) -> NoteCategoryService:
    return NoteCategoryService(NoteCategoryRepository(db), NoteRepository(db))


@router.get("", response_model=SuccessResponse[list[NoteCategoryResponse]])
def list_categories(
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service: NoteCategoryService = Depends(_get_note_category_service),
) -> dict:
    """カテゴリ一覧を取得."""
    categories = service.list_categories(
        user_id=current_user.id, skip=skip, limit=limit
    )
    return {
        "data": [NoteCategoryResponse.model_validate(c) for c in categories],
        "message": "カテゴリ一覧を取得しました",
    }


@router.post(
    "",
    response_model=SuccessResponse[NoteCategoryResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    current_user: CurrentUser,
    payload: NoteCategoryCreate,
    service: NoteCategoryService = Depends(_get_note_category_service),
) -> dict:
    """新規カテゴリを作成."""
    created = service.create_category(payload, current_user.id)
    return {
        "data": NoteCategoryResponse.model_validate(created),
        "message": "カテゴリが作成されました",
    }


@router.get("/{category_id}", response_model=SuccessResponse[NoteCategoryResponse])
def get_category(
    current_user: CurrentUser,
    category_id: UUID,
    service: NoteCategoryService = Depends(_get_note_category_service),
) -> dict:
    """カテゴリを取得."""
    category = service.get_category(category_id, current_user.id)
    return {
        "data": NoteCategoryResponse.model_validate(category),
        "message": "カテゴリが取得されました",
    }


@router.put("/{category_id}", response_model=SuccessResponse[NoteCategoryResponse])
def update_category(
    current_user: CurrentUser,
    category_id: UUID,
    payload: NoteCategoryUpdate,
    service: NoteCategoryService = Depends(_get_note_category_service),
) -> dict:
    """カテゴリを更新."""
    updated = service.update_category(category_id, payload, current_user.id)
    return {
        "data": NoteCategoryResponse.model_validate(updated),
        "message": "カテゴリが更新されました",
    }


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    current_user: CurrentUser,
    category_id: UUID,
    service: NoteCategoryService = Depends(_get_note_category_service),
) -> Response:
    """カテゴリを削除."""
    service.delete_category(category_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
