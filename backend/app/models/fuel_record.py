"""燃費記録モデル."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin


class FuelRecord(UUIDPKMixin, TimestampMixin, SoftDeleteMixin, Base):
    """燃費記録モデル."""

    __tablename__ = "fuel_record"

    vehicle_id: Mapped[UUID] = mapped_column(index=True)
    user_id: Mapped[UUID] = mapped_column(index=True)
    refuel_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    total_mileage: Mapped[int] = mapped_column(Integer)
    fuel_type: Mapped[str] = mapped_column(String(50))
    unit_price: Mapped[int] = mapped_column(Integer)
    total_cost: Mapped[int] = mapped_column(Integer)
    is_full_tank: Mapped[bool] = mapped_column(Boolean, default=False)
    gas_station_name: Mapped[str | None] = mapped_column(String(255))
