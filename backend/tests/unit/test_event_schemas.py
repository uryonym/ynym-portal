"""カレンダー予定スキーマ単体テスト."""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.schemas.event import EventCreate, EventUpdate

JST = timezone(timedelta(hours=9))


class TestEventCreateSchema:
    """EventCreate のバリデーションテスト."""

    def test_valid_event_create(self) -> None:
        """正常な予定作成データ."""
        now = datetime.now(JST)
        data = EventCreate(
            title="家族会議",
            description="今後の計画について",
            location="リビング",
            start_at=now,
            end_at=now + timedelta(hours=1),
            is_all_day=False,
            is_private=False,
            participant_ids=[uuid4()],
        )
        assert data.title == "家族会議"
        assert data.is_private is False
        assert len(data.participant_ids) == 1

    def test_strip_title_whitespace(self) -> None:
        """タイトルの前後空白がトリムされる."""
        now = datetime.now(JST)
        data = EventCreate(
            title="  買い物  ",
            start_at=now,
            end_at=now + timedelta(hours=1),
        )
        assert data.title == "買い物"

    def test_empty_title_raises_validation_error(self) -> None:
        """空白のみのタイトルはバリデーションエラー."""
        now = datetime.now(JST)
        with pytest.raises(ValidationError):
            EventCreate(
                title="   ",
                start_at=now,
                end_at=now + timedelta(hours=1),
            )

    def test_end_at_must_be_after_start_at(self) -> None:
        """終了日時が開始日時以下はバリデーションエラー."""
        now = datetime.now(JST)
        with pytest.raises(ValidationError) as exc_info:
            EventCreate(
                title="旅行",
                start_at=now,
                end_at=now,  # 同一時刻
            )
        assert "終了日時は開始日時より後である必要があります" in str(exc_info.value)

        with pytest.raises(ValidationError):
            EventCreate(
                title="旅行",
                start_at=now,
                end_at=now - timedelta(hours=1),  # 開始より前
            )

    def test_is_private_default_is_false(self) -> None:
        """is_private のデフォルトは False（家族共有）."""
        now = datetime.now(JST)
        data = EventCreate(
            title="夕飯",
            start_at=now,
            end_at=now + timedelta(hours=1),
        )
        assert data.is_private is False


class TestEventUpdateSchema:
    """EventUpdate のバリデーションテスト."""

    def test_valid_partial_update(self) -> None:
        """部分更新が有効."""
        data = EventUpdate(title="タイトル変更")
        assert data.title == "タイトル変更"
        assert data.start_at is None

    def test_end_at_after_start_at_validation(self) -> None:
        """両方指定された場合に前後関係が検証される."""
        now = datetime.now(JST)
        with pytest.raises(ValidationError):
            EventUpdate(
                start_at=now,
                end_at=now - timedelta(minutes=10),
            )
