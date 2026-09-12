"""車両モデル."""

from uuid import UUID

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin


class Vehicle(UUIDPKMixin, TimestampMixin, SoftDeleteMixin, Base):
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
