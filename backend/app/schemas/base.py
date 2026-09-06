"""共通レスポンス構造のベーススキーマ."""

from typing import Any

from pydantic import BaseModel


class SuccessResponse(BaseModel):
    """標準成功レスポンスモデル."""

    data: Any
    message: str = "成功"


class ErrorResponse(BaseModel):
    """標準エラーレスポンスモデル."""

    detail: str
    status_code: int
    error_type: str | None = None
