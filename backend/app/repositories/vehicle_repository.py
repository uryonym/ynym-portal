"""車両リポジトリ."""

from uuid import UUID

from sqlalchemy import asc, desc, func, select

from app.models.vehicle import Vehicle
from app.repositories.base import BaseRepository


class VehicleRepository(BaseRepository[Vehicle]):
    """車両に関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, Vehicle)

    def list_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Vehicle]:
        """ユーザーの車両一覧を seq 昇順で取得."""
        stmt = (
            select(Vehicle)
            .where(Vehicle.user_id == user_id)
            .where(Vehicle.deleted_at.is_(None))
            .order_by(asc(Vehicle.seq))
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def get_by_id_and_user(self, vehicle_id: UUID, user_id: UUID) -> Vehicle | None:
        """vehicle_id と user_id で車両を取得（所有権確認）."""
        stmt = (
            select(Vehicle)
            .where(Vehicle.id == vehicle_id)
            .where(Vehicle.user_id == user_id)
            .where(Vehicle.deleted_at.is_(None))
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def get_max_seq(self, user_id: UUID) -> int:
        """ユーザーの最大 seq を返す（車両がない場合は 0）."""
        stmt = (
            select(Vehicle)
            .where(Vehicle.user_id == user_id)
            .where(Vehicle.deleted_at.is_(None))
            .order_by(desc(Vehicle.seq))
            .limit(1)
        )
        last = self.session.execute(stmt).scalars().one_or_none()
        return last.seq if last else 0

    def list_deleted_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Vehicle]:
        """論理削除された車両一覧を取得（削除日時降順）."""
        stmt = (
            select(Vehicle)
            .where(Vehicle.user_id == user_id)
            .where(Vehicle.deleted_at.is_not(None))
            .order_by(Vehicle.deleted_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_deleted_by_user(self, user_id: UUID) -> int:
        """論理削除された車両の総件数を取得."""
        stmt = (
            select(func.count())
            .select_from(Vehicle)
            .where(Vehicle.user_id == user_id)
            .where(Vehicle.deleted_at.is_not(None))
        )
        return self.session.execute(stmt).scalar() or 0

    def get_deleted_by_id_and_user(
        self, vehicle_id: UUID, user_id: UUID
    ) -> Vehicle | None:
        """vehicle_id と user_id で論理削除された車両を取得."""
        stmt = (
            select(Vehicle)
            .where(Vehicle.id == vehicle_id)
            .where(Vehicle.user_id == user_id)
            .where(Vehicle.deleted_at.is_not(None))
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def get_by_id_including_deleted(
        self, vehicle_id: UUID, user_id: UUID
    ) -> Vehicle | None:
        """削除状態に関わらず vehicle_id と user_id で車両を取得."""
        stmt = (
            select(Vehicle)
            .where(Vehicle.id == vehicle_id)
            .where(Vehicle.user_id == user_id)
        )
        return self.session.execute(stmt).scalars().one_or_none()
