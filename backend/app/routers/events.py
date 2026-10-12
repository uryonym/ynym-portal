"""予定（カレンダーイベント）関連エンドポイント."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.event_repository import EventRepository
from app.repositories.user_repository import UserRepository
from app.schemas.base import SuccessResponse
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.security.deps import CurrentUser
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["events"])


def _get_event_service(db: SessionDep) -> EventService:
    return EventService(EventRepository(db), UserRepository(db))


@router.get("", response_model=SuccessResponse[list[EventResponse]])
def list_events(
    current_user: CurrentUser,
    start: datetime = Query(..., description="期間開始日時（ISO 8601）"),
    end: datetime = Query(..., description="期間終了日時（ISO 8601）"),
    member_ids: list[UUID] | None = Query(
        None, description="メンバーID絞り込み（複数指定可）"
    ),
    service: EventService = Depends(_get_event_service),
) -> dict:
    """期間内の予定一覧を取得."""
    events = service.list_events(
        start=start,
        end=end,
        user_id=current_user.id,
        member_ids=member_ids,
    )
    return {
        "data": [EventResponse.model_validate(e) for e in events],
        "message": "予定一覧を取得しました",
    }


@router.post(
    "",
    response_model=SuccessResponse[EventResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    current_user: CurrentUser,
    payload: EventCreate,
    service: EventService = Depends(_get_event_service),
) -> dict:
    """新規予定を作成."""
    created = service.create_event(payload, current_user.id)
    return {
        "data": EventResponse.model_validate(created),
        "message": "予定が作成されました",
    }


@router.get("/{event_id}", response_model=SuccessResponse[EventResponse])
def get_event(
    current_user: CurrentUser,
    event_id: UUID,
    service: EventService = Depends(_get_event_service),
) -> dict:
    """予定詳細を取得."""
    event = service.get_event(event_id, current_user.id)
    return {
        "data": EventResponse.model_validate(event),
        "message": "予定を取得しました",
    }


@router.put("/{event_id}", response_model=SuccessResponse[EventResponse])
def update_event(
    current_user: CurrentUser,
    event_id: UUID,
    payload: EventUpdate,
    service: EventService = Depends(_get_event_service),
) -> dict:
    """予定を更新."""
    updated = service.update_event(event_id, payload, current_user.id)
    return {
        "data": EventResponse.model_validate(updated),
        "message": "予定が更新されました",
    }


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    current_user: CurrentUser,
    event_id: UUID,
    service: EventService = Depends(_get_event_service),
) -> Response:
    """予定を論理削除."""
    service.delete_event(event_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
