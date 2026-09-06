"""ノート関連エンドポイント."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.schemas.base import SuccessResponse
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate
from app.security.deps import CurrentUser
from app.services.note_service import NoteService

router = APIRouter(prefix="/notes", tags=["notes"])


def _get_note_service(db: SessionDep) -> NoteService:
    return NoteService(NoteRepository(db), NoteCategoryRepository(db))


@router.get("", response_model=SuccessResponse[list[NoteResponse]])
def list_notes(
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service: NoteService = Depends(_get_note_service),
) -> dict:
    """ノート一覧を取得."""
    notes = service.list_notes(user_id=current_user.id, skip=skip, limit=limit)
    return {
        "data": [NoteResponse.model_validate(n) for n in notes],
        "message": "ノート一覧を取得しました",
    }


@router.post(
    "",
    response_model=SuccessResponse[NoteResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_note(
    current_user: CurrentUser,
    payload: NoteCreate,
    service: NoteService = Depends(_get_note_service),
) -> dict:
    """新規ノートを作成."""
    created = service.create_note(payload, current_user.id)
    return {
        "data": NoteResponse.model_validate(created),
        "message": "ノートが作成されました",
    }


@router.get("/{note_id}", response_model=SuccessResponse[NoteResponse])
def get_note(
    current_user: CurrentUser,
    note_id: UUID,
    service: NoteService = Depends(_get_note_service),
) -> dict:
    """ノートを取得."""
    note = service.get_note(note_id, current_user.id)
    return {
        "data": NoteResponse.model_validate(note),
        "message": "ノートが取得されました",
    }


@router.put("/{note_id}", response_model=SuccessResponse[NoteResponse])
def update_note(
    current_user: CurrentUser,
    note_id: UUID,
    payload: NoteUpdate,
    service: NoteService = Depends(_get_note_service),
) -> dict:
    """ノートを更新."""
    updated = service.update_note(note_id, payload, current_user.id)
    return {
        "data": NoteResponse.model_validate(updated),
        "message": "ノートが更新されました",
    }


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    current_user: CurrentUser,
    note_id: UUID,
    service: NoteService = Depends(_get_note_service),
) -> Response:
    """ノートを削除."""
    service.delete_note(note_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
