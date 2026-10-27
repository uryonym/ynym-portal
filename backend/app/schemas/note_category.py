"""ノートカテゴリ関連の Pydantic スキーマ."""

from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.schemas.base import SoftDeleteEntityResponseBase


class NoteCategoryCreate(BaseModel):
    """カテゴリ作成スキーマ."""

    name: str = Field(
        ..., min_length=1, max_length=255, description="カテゴリ名（必須、1-255 文字）"
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """カテゴリ名のバリデーション."""
        if not v or not v.strip():
            raise ValueError("カテゴリ名は必須項目です")
        if len(v) > 255:
            raise ValueError("カテゴリ名は 255 文字以内である必要があります")
        return v.strip()


class NoteCategoryUpdate(BaseModel):
    """カテゴリ更新スキーマ."""

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="カテゴリ名（オプション）",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        """カテゴリ名のバリデーション."""
        if v is not None:
            if not v.strip():
                raise ValueError("カテゴリ名は空にできません")
            if len(v) > 255:
                raise ValueError("カテゴリ名は 255 文字以内である必要があります")
            return v.strip()
        return v


class NoteCategoryResponse(SoftDeleteEntityResponseBase):
    """カテゴリレスポンススキーマ."""

    user_id: UUID = Field(description="所有者ユーザー ID（UUID）")
    name: str = Field(description="カテゴリ名")
