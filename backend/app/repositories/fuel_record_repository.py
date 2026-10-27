"""燃費記録リポジトリ."""

from uuid import UUID

from sqlalchemy import asc, desc, func, select

from app.models.fuel_record import FuelRecord
from app.repositories.base import UserOwnedSoftDeleteRepository


class FuelRecordRepository(UserOwnedSoftDeleteRepository[FuelRecord]):
    """燃費記録に関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, FuelRecord)

    def list_by_user_and_vehicle(
        self,
        user_id: UUID,
        vehicle_id: UUID | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[FuelRecord]:
        """ユーザー（＋車両）の燃費記録を給油日時の降順で取得."""
        stmt = select(FuelRecord).where(
            FuelRecord.user_id == user_id,
            FuelRecord.deleted_at.is_(None),
        )
        if vehicle_id:
            stmt = stmt.where(FuelRecord.vehicle_id == vehicle_id)
        stmt = (
            stmt.order_by(desc(FuelRecord.refuel_datetime)).limit(limit).offset(offset)
        )
        return list(self.session.execute(stmt).scalars().all())

    def list_all_by_vehicle_asc(
        self, user_id: UUID, vehicle_id: UUID
    ) -> list[FuelRecord]:
        """燃費計算用: 指定車両の全レコードを給油日時昇順で取得."""
        stmt = (
            select(FuelRecord)
            .where(
                FuelRecord.user_id == user_id,
                FuelRecord.vehicle_id == vehicle_id,
                FuelRecord.deleted_at.is_(None),
            )
            .order_by(asc(FuelRecord.refuel_datetime))
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_by_vehicle(self, user_id: UUID, vehicle_id: UUID) -> int:
        """指定車両の有効な燃費記録件数を取得."""
        stmt = (
            select(func.count())
            .select_from(FuelRecord)
            .where(
                FuelRecord.user_id == user_id,
                FuelRecord.vehicle_id == vehicle_id,
                FuelRecord.deleted_at.is_(None),
            )
        )
        return self.session.execute(stmt).scalar() or 0

    def count_by_vehicle_including_deleted(
        self, user_id: UUID, vehicle_id: UUID
    ) -> int:
        """指定車両の燃費記録件数を論理削除問わず取得."""
        stmt = (
            select(func.count())
            .select_from(FuelRecord)
            .where(
                FuelRecord.user_id == user_id,
                FuelRecord.vehicle_id == vehicle_id,
            )
        )
        return self.session.execute(stmt).scalar() or 0
