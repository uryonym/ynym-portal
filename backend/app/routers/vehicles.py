"""車両関連エンドポイント."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.base import SuccessResponse
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate
from app.security.deps import CurrentUser
from app.services.vehicle_service import VehicleService

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


def _get_vehicle_service(db: SessionDep) -> VehicleService:
    return VehicleService(VehicleRepository(db))


@router.get("", response_model=SuccessResponse[list[VehicleResponse]])
def list_vehicles(
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service: VehicleService = Depends(_get_vehicle_service),
) -> dict:
    """所有する車両一覧を取得."""
    vehicles = service.list_vehicles(user_id=current_user.id, skip=skip, limit=limit)
    return {
        "data": [VehicleResponse.model_validate(v) for v in vehicles],
        "message": "車一覧を取得しました",
    }


@router.post(
    "",
    response_model=SuccessResponse[VehicleResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle(
    current_user: CurrentUser,
    payload: VehicleCreate,
    service: VehicleService = Depends(_get_vehicle_service),
) -> dict:
    """新規車両を作成."""
    created = service.create_vehicle(payload, current_user.id)
    return {
        "data": VehicleResponse.model_validate(created),
        "message": "車が作成されました",
    }


@router.get("/{vehicle_id}", response_model=SuccessResponse[VehicleResponse])
def get_vehicle(
    current_user: CurrentUser,
    vehicle_id: UUID,
    service: VehicleService = Depends(_get_vehicle_service),
) -> dict:
    """車両を取得."""
    vehicle = service.get_vehicle(vehicle_id, current_user.id)
    return {
        "data": VehicleResponse.model_validate(vehicle),
        "message": "車が取得されました",
    }


@router.put("/{vehicle_id}", response_model=SuccessResponse[VehicleResponse])
def update_vehicle(
    current_user: CurrentUser,
    vehicle_id: UUID,
    payload: VehicleUpdate,
    service: VehicleService = Depends(_get_vehicle_service),
) -> dict:
    """車両を更新."""
    updated = service.update_vehicle(vehicle_id, payload, current_user.id)
    return {
        "data": VehicleResponse.model_validate(updated),
        "message": "車が更新されました",
    }


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    current_user: CurrentUser,
    vehicle_id: UUID,
    service: VehicleService = Depends(_get_vehicle_service),
) -> Response:
    """車両を削除."""
    service.delete_vehicle(vehicle_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
