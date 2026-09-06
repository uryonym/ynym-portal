"""車両モデル."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPKMixin


class Vehicle(UUIDPKMixin, TimestampMixin, Base):
    """車両モデル."""

    __tablename__ = "vehicle"

    user_id: Mapped[UUID] = mapped_column(index=True)
    name: Mapped[str] = mapped_column(String(255))
    seq: Mapped[int] = mapped_column(Integer)
    maker: Mapped[str] = mapped_column(String(100))
    model: Mapped[str] = mapped_column(String(100))
    year: Mapped[int | None] = mapped_column(Integer)
    number: Mapped[str | None] = mapped_column(String(50))
    tank_capacity: Mapped[float | None] = mapped_column(Float)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), index=True
    )
