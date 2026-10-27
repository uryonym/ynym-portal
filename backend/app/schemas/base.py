"""共通レスポンス構造のベーススキーマ."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SuccessResponse[DataT](BaseModel):
    """標準成功レスポンスモデル."""

    data: DataT
    message: str = "成功"


class MessageResponse(BaseModel):
    """メッセージのみのレスポンスモデル."""

    message: str


class ErrorResponse(BaseModel):
    """標準エラーレスポンスモデル."""

    detail: str
    status_code: int
    error_type: str | None = None


class EntityResponseBase(BaseModel):
    """永続化エンティティ共通レスポンス基底クラス."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(description="エンティティ ID（UUID）")
    created_at: datetime = Field(description="作成日時（ISO 8601 形式、JST）")
    updated_at: datetime = Field(description="更新日時（ISO 8601 形式、JST）")


class SoftDeleteEntityResponseBase(EntityResponseBase):
    """論理削除対応エンティティ共通レスポンス基底クラス."""

    deleted_at: datetime | None = Field(
        default=None, description="削除日時（ISO 8601 形式、JST）"
    )
