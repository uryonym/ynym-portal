"""タスクモデル."""

from datetime import date, datetime
from uuid import UUID

from sqlalchemy import Boolean, Date, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin


class Task(UUIDPKMixin, TimestampMixin, SoftDeleteMixin, Base):
    """タスクモデル."""

    __tablename__ = "task"

    user_id: Mapped[UUID] = mapped_column(index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(String(2000))
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    due_date: Mapped[date | None] = mapped_column(Date, index=True)
    order: Mapped[int] = mapped_column(Integer, default=0)
