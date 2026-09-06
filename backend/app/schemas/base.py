"""共通レスポンス構造のベーススキーマ."""

from pydantic import BaseModel


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
