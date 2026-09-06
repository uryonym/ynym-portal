"""燃費記録関連エンドポイント."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.db import SessionDep
from app.repositories.fuel_record_repository import FuelRecordRepository
from app.schemas.base import SuccessResponse
from app.schemas.fuel_record import (
    FuelRecordCreate,
    FuelRecordResponse,
    FuelRecordUpdate,
)
from app.security.deps import CurrentUser
from app.services.fuel_record_service import FuelRecordService
from app.utils.exceptions import NotFoundException

router = APIRouter(prefix="/fuel-records", tags=["fuel-records"])


def _get_fuel_service(db: SessionDep) -> FuelRecordService:
    return FuelRecordService(FuelRecordRepository(db))


def _to_fuel_record_response(item, is_detailed: bool = False) -> FuelRecordResponse:
    record = item.record if hasattr(item, "record") else item
    return FuelRecordResponse(
        id=record.id,
        vehicle_id=record.vehicle_id,
        user_id=record.user_id,
        refuel_datetime=record.refuel_datetime,
        total_mileage=record.total_mileage,
        fuel_type=record.fuel_type,
        unit_price=record.unit_price,
        total_cost=record.total_cost,
        is_full_tank=record.is_full_tank,
        gas_station_name=record.gas_station_name,
        distance_traveled=item.distance_traveled if is_detailed else None,
        fuel_amount=item.fuel_amount if is_detailed else None,
        fuel_efficiency=item.fuel_efficiency if is_detailed else None,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


@router.get("", response_model=SuccessResponse[list[FuelRecordResponse]])
def list_fuel_records(
    current_user: CurrentUser,
    vehicle_id: UUID = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service: FuelRecordService = Depends(_get_fuel_service),
) -> dict:
    """燃費記録一覧取得."""
    items = service.list_fuel_records(
        user_id=current_user.id, vehicle_id=vehicle_id, limit=limit, offset=skip
    )
    responses = [_to_fuel_record_response(item, is_detailed=True) for item in items]
    return {"data": responses, "message": "燃費記録一覧を取得しました"}


@router.post(
    "",
    response_model=SuccessResponse[FuelRecordResponse],
    status_code=status.HTTP_201_CREATED,
)
def create_fuel_record(
    current_user: CurrentUser,
    payload: FuelRecordCreate,
    service: FuelRecordService = Depends(_get_fuel_service),
) -> dict:
    """燃費記録を作成."""
    created = service.create_fuel_record(payload, current_user.id)
    return {
        "data": _to_fuel_record_response(created),
        "message": "燃費記録が作成されました",
    }


@router.get("/{fuel_record_id}", response_model=SuccessResponse[FuelRecordResponse])
def get_fuel_record(
    current_user: CurrentUser,
    fuel_record_id: UUID,
    service: FuelRecordService = Depends(_get_fuel_service),
) -> dict:
    """燃費記録を取得."""
    record = service.get_fuel_record(fuel_record_id, current_user.id)
    if not record:
        raise NotFoundException("燃費記録が見つかりません")
    return {
        "data": _to_fuel_record_response(record),
        "message": "燃費記録を取得しました",
    }


@router.put("/{fuel_record_id}", response_model=SuccessResponse[FuelRecordResponse])
def update_fuel_record(
    current_user: CurrentUser,
    fuel_record_id: UUID,
    payload: FuelRecordUpdate,
    service: FuelRecordService = Depends(_get_fuel_service),
) -> dict:
    """燃費記録を更新."""
    updated = service.update_fuel_record(fuel_record_id, payload, current_user.id)
    if not updated:
        raise NotFoundException("燃費記録が見つかりません")
    return {
        "data": _to_fuel_record_response(updated),
        "message": "燃費記録が更新されました",
    }


@router.delete("/{fuel_record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_fuel_record(
    current_user: CurrentUser,
    fuel_record_id: UUID,
    service: FuelRecordService = Depends(_get_fuel_service),
) -> Response:
    """燃費記録を削除."""
    deleted = service.delete_fuel_record(fuel_record_id, current_user.id)
    if not deleted:
        raise NotFoundException("燃費記録が見つかりません")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
