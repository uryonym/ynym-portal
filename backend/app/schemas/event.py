"""予定（カレンダーイベント）関連スキーマ."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class EventParticipantResponse(BaseModel):
    """予定参加者スキーマ."""

    id: UUID
    name: str
    avatar_url: str | None = None
    color: str | None = None

    model_config = ConfigDict(from_attributes=True)


class EventBase(BaseModel):
    """予定共通ベーススキーマ."""

    title: str = Field(..., min_length=1, max_length=255, description="予定タイトル")
    description: str | None = Field(None, description="詳細・メモ")
    location: str | None = Field(None, max_length=255, description="場所")
    start_at: datetime = Field(..., description="開始日時（ISO 8601）")
    end_at: datetime = Field(..., description="終了日時（ISO 8601）")
    is_all_day: bool = Field(False, description="終日フラグ")
    is_private: bool = Field(False, description="プライベートフラグ（自分のみ表示）")
    participant_ids: list[UUID] = Field(
        default_factory=list, description="参加者ユーザーID一覧（空は家族全員）"
    )


class EventCreate(EventBase):
    """予定作成スキーマ."""

    @model_validator(mode="after")
    def validate_event(self) -> "EventCreate":
        self.title = self.title.strip()
        if not self.title:
            raise ValueError("タイトルを入力してください")
        if self.end_at <= self.start_at:
            raise ValueError("終了日時は開始日時より後である必要があります")
        return self


class EventUpdate(BaseModel):
    """予定更新スキーマ."""

    title: str | None = Field(
        None, min_length=1, max_length=255, description="予定タイトル"
    )
    description: str | None = Field(None, description="詳細・メモ")
    location: str | None = Field(None, max_length=255, description="場所")
    start_at: datetime | None = Field(None, description="開始日時（ISO 8601）")
    end_at: datetime | None = Field(None, description="終了日時（ISO 8601）")
    is_all_day: bool | None = Field(None, description="終日フラグ")
    is_private: bool | None = Field(
        None, description="プライベートフラグ（自分のみ表示）"
    )
    participant_ids: list[UUID] | None = Field(
        None, description="参加者ユーザーID一覧（空は家族全員）"
    )

    @model_validator(mode="after")
    def validate_update(self) -> "EventUpdate":
        if self.title is not None:
            self.title = self.title.strip()
            if not self.title:
                raise ValueError("タイトルを入力してください")
        if self.start_at is not None and self.end_at is not None:
            if self.end_at <= self.start_at:
                raise ValueError("終了日時は開始日時より後である必要があります")
        return self


class EventResponse(BaseModel):
    """予定レスポンススキーマ."""

    id: UUID
    created_by: UUID
    title: str
    description: str | None = None
    location: str | None = None
    start_at: datetime
    end_at: datetime
    is_all_day: bool
    is_private: bool
    participants: list[EventParticipantResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
