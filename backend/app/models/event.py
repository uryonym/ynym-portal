"""予定（カレンダーイベント）モデル."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    String,
    Table,
    Text,
)
from sqlalchemy.orm import Mapped, foreign, mapped_column, relationship

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin
from app.models.user import User

event_participants = Table(
    "event_participants",
    Base.metadata,
    Column("event_id", ForeignKey("events.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "user_id",
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    ),
)


class Event(UUIDPKMixin, TimestampMixin, SoftDeleteMixin, Base):
    """カレンダー予定モデル."""

    __tablename__ = "events"
    __table_args__ = (
        CheckConstraint("end_at > start_at", name="chk_events_end_after_start"),
    )

    created_by: Mapped[UUID] = mapped_column(index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    is_all_day: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, server_default="false"
    )
    is_private: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, server_default="false"
    )

    creator: Mapped[User] = relationship(
        "User",
        primaryjoin=lambda: foreign(Event.created_by) == User.id,
    )
    participants: Mapped[list[User]] = relationship(
        "User",
        secondary=event_participants,
        lazy="selectin",
    )
