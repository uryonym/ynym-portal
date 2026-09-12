"""燃費記録リポジトリ."""

from uuid import UUID

from sqlalchemy import asc, desc, func, select

from app.models.fuel_record import FuelRecord
from app.repositories.base import BaseRepository


class FuelRecordRepository(BaseRepository[FuelRecord]):
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

    def get_by_id_and_user(self, record_id: UUID, user_id: UUID) -> FuelRecord | None:
        """record_id と user_id で燃費記録を取得（所有権確認）."""
        stmt = select(FuelRecord).where(
            FuelRecord.id == record_id,
            FuelRecord.user_id == user_id,
            FuelRecord.deleted_at.is_(None),
        )
        return self.session.execute(stmt).scalars().one_or_none()

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

    def list_deleted_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[FuelRecord]:
        """論理削除された燃費記録一覧を取得（削除日時降順）."""
        stmt = (
            select(FuelRecord)
            .where(
                FuelRecord.user_id == user_id,
                FuelRecord.deleted_at.is_not(None),
            )
            .order_by(FuelRecord.deleted_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_deleted_by_user(self, user_id: UUID) -> int:
        """論理削除された燃費記録の総件数を取得."""
        stmt = (
            select(func.count())
            .select_from(FuelRecord)
            .where(
                FuelRecord.user_id == user_id,
                FuelRecord.deleted_at.is_not(None),
            )
        )
        return self.session.execute(stmt).scalar() or 0

    def get_deleted_by_id_and_user(
        self, record_id: UUID, user_id: UUID
    ) -> FuelRecord | None:
        """record_id と user_id で論理削除された燃費記録を取得."""
        stmt = select(FuelRecord).where(
            FuelRecord.id == record_id,
            FuelRecord.user_id == user_id,
            FuelRecord.deleted_at.is_not(None),
        )
        return self.session.execute(stmt).scalars().one_or_none()
