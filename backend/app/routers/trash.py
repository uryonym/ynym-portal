"""ゴミ箱関連エンドポイント."""

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.fuel_record_repository import FuelRecordRepository
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.base import SuccessResponse
from app.schemas.fuel_record import FuelRecordResponse
from app.schemas.note import NoteResponse
from app.schemas.note_category import NoteCategoryResponse
from app.schemas.task import TaskResponse
from app.schemas.trash import TrashResourceType, TrashSummary
from app.schemas.vehicle import VehicleResponse
from app.security.deps import CurrentUser
from app.services.trash_service import TrashService

router = APIRouter(prefix="/trash", tags=["trash"])

_SCHEMA_MAP: dict[str, type] = {
    "tasks": TaskResponse,
    "notes": NoteResponse,
    "note_categories": NoteCategoryResponse,
    "vehicles": VehicleResponse,
    "fuel_records": FuelRecordResponse,
}

_LABEL_MAP: dict[str, str] = {
    "tasks": "タスク",
    "notes": "ノート",
    "note_categories": "ノートカテゴリ",
    "vehicles": "車両",
    "fuel_records": "燃費記録",
}


def _get_trash_service(db: SessionDep) -> TrashService:
    return TrashService(
        task_repo=TaskRepository(db),
        note_repo=NoteRepository(db),
        note_category_repo=NoteCategoryRepository(db),
        vehicle_repo=VehicleRepository(db),
        fuel_record_repo=FuelRecordRepository(db),
    )


@router.get("/summary", response_model=SuccessResponse[TrashSummary])
def get_trash_summary(
    current_user: CurrentUser,
    service: TrashService = Depends(_get_trash_service),
) -> dict[str, Any]:
    """ゴミ箱内の各リソース件数サマリーを取得."""
    summary = service.get_summary(current_user.id)
    return {
        "data": summary,
        "message": "ゴミ箱サマリーを取得しました",
    }


@router.get("/{resource_type}", response_model=SuccessResponse[list[Any]])
def list_trash_items(
    current_user: CurrentUser,
    resource_type: TrashResourceType,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service: TrashService = Depends(_get_trash_service),
) -> dict[str, Any]:
    """指定リソースのゴミ箱一覧を取得."""
    items = service.list_items(resource_type, current_user.id, skip=skip, limit=limit)
    schema_cls = _SCHEMA_MAP[resource_type]
    label = _LABEL_MAP[resource_type]
    return {
        "data": [schema_cls.model_validate(item) for item in items],
        "message": f"削除された{label}一覧を取得しました",
    }


@router.post("/{resource_type}/{item_id}/restore", response_model=SuccessResponse[Any])
def restore_trash_item(
    current_user: CurrentUser,
    resource_type: TrashResourceType,
    item_id: UUID,
    service: TrashService = Depends(_get_trash_service),
) -> dict[str, Any]:
    """論理削除されたデータを復元."""
    restored = service.restore_item(resource_type, item_id, current_user.id)
    schema_cls = _SCHEMA_MAP[resource_type]
    label = _LABEL_MAP[resource_type]
    return {
        "data": schema_cls.model_validate(restored),
        "message": f"{label}を復元しました",
    }


@router.delete("/{resource_type}/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def purge_trash_item(
    current_user: CurrentUser,
    resource_type: TrashResourceType,
    item_id: UUID,
    service: TrashService = Depends(_get_trash_service),
) -> Response:
    """論理削除されたデータを物理削除（完全削除）."""
    service.purge_item(resource_type, item_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{resource_type}", response_model=SuccessResponse[dict[str, int]])
def empty_trash_resource(
    current_user: CurrentUser,
    resource_type: TrashResourceType,
    service: TrashService = Depends(_get_trash_service),
) -> dict[str, Any]:
    """指定リソースのゴミ箱を空にする（一括完全削除）."""
    count = service.empty_trash(resource_type, current_user.id)
    label = _LABEL_MAP[resource_type]
    return {
        "data": {"purged_count": count},
        "message": f"{count}件の{label}を完全削除しました",
    }
