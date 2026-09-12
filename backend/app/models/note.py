"""ノートモデル."""

from uuid import UUID

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SoftDeleteMixin, TimestampMixin, UUIDPKMixin


class Note(UUIDPKMixin, TimestampMixin, SoftDeleteMixin, Base):
    """ノートモデル."""

    __tablename__ = "notes"

    user_id: Mapped[UUID] = mapped_column(index=True)
    category_id: Mapped[UUID | None] = mapped_column(index=True)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text)
