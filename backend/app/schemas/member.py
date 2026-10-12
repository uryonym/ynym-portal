"""家族メンバー関連スキーマ."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MemberResponse(BaseModel):
    """家族メンバースキーマ（一般ユーザー向け軽量表現）."""

    id: UUID
    name: str
    avatar_url: str | None = None
    color: str | None = None

    model_config = ConfigDict(from_attributes=True)


class MemberColorUpdate(BaseModel):
    """メンバー表示色更新スキーマ."""

    color: str | None = Field(
        None,
        pattern=r"^#[0-9a-fA-F]{6}$",
        description="カラーコード（#RRGGBB形式、またはNULL）",
    )
