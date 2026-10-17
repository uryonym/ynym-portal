"""予定サービス単体テスト."""

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
from uuid import uuid4

import pytest

from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate
from app.services.event_service import EventService
from app.utils.exceptions import (
    AuthorizationException,
    NotFoundException,
    ValidationException,
)

JST = timezone(timedelta(hours=9))
USER_ID_A = uuid4()
USER_ID_B = uuid4()


@pytest.fixture
def mock_event_repo() -> MagicMock:
    return MagicMock()


@pytest.fixture
def mock_user_repo() -> MagicMock:
    return MagicMock()


@pytest.fixture
def service(mock_event_repo: MagicMock, mock_user_repo: MagicMock) -> EventService:
    return EventService(mock_event_repo, mock_user_repo)


class TestEventServiceListEvents:
    """list_events のテスト."""

    def test_end_before_start_raises_validation_error(
        self, service: EventService
    ) -> None:
        """終了日時が開始日時以前の場合は ValidationException."""
        now = datetime.now(JST)
        with pytest.raises(ValidationException):
            service.list_events(start=now, end=now, user_id=USER_ID_A)

    def test_over_93_days_raises_validation_error(self, service: EventService) -> None:
        """取得期間が93日を超える場合は ValidationException."""
        now = datetime.now(JST)
        with pytest.raises(ValidationException):
            service.list_events(
                start=now,
                end=now + timedelta(days=94),
                user_id=USER_ID_A,
            )

    def test_calls_repository_with_correct_args(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """正常な期間指定でリポジトリが呼び出される."""
        now = datetime.now(JST)
        end = now + timedelta(days=30)
        mock_event_repo.list_in_range.return_value = []

        result = service.list_events(start=now, end=end, user_id=USER_ID_A)
        assert result == []
        mock_event_repo.list_in_range.assert_called_once_with(
            start_at=now,
            end_at=end,
            user_id=USER_ID_A,
            member_ids=None,
        )


class TestEventServiceCreateEvent:
    """create_event のテスト."""

    def test_create_shared_event_without_participants(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """参加者未指定で家族全員共有予定を作成."""
        now = datetime.now(JST)
        payload = EventCreate(
            title="家族旅行",
            start_at=now,
            end_at=now + timedelta(days=2),
            is_all_day=True,
            is_private=False,
        )

        mock_event_repo.save.side_effect = lambda e: e
        event = service.create_event(payload, USER_ID_A)

        assert event.title == "家族旅行"
        assert event.created_by == USER_ID_A
        assert event.is_private is False
        assert event.participants == []
        mock_event_repo.save.assert_called_once()

    def test_create_event_with_nonexistent_participant_raises(
        self,
        service: EventService,
        mock_user_repo: MagicMock,
    ) -> None:
        """存在しない参加者IDが指定された場合は NotFoundException."""
        now = datetime.now(JST)
        p_id = uuid4()
        payload = EventCreate(
            title="通院",
            start_at=now,
            end_at=now + timedelta(hours=1),
            participant_ids=[p_id],
        )
        mock_user_repo.get_by_ids.return_value = []  # 見つからない

        with pytest.raises(NotFoundException):
            service.create_event(payload, USER_ID_A)


class TestEventServiceUpdateEvent:
    """update_event のテスト."""

    def test_shared_event_can_be_updated_by_other_user(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """家族共有予定（is_private=False）は別ユーザーでも更新できる."""
        now = datetime.now(JST)
        existing = Event(
            id=uuid4(),
            created_by=USER_ID_A,
            title="買い物",
            start_at=now,
            end_at=now + timedelta(hours=1),
            is_private=False,
        )
        mock_event_repo.get_by_id.return_value = existing
        mock_event_repo.save.side_effect = lambda e: e

        updated = service.update_event(
            existing.id,
            EventUpdate(title="買い出し（大型スーパー）"),
            user_id=USER_ID_B,  # 別ユーザー
        )
        assert updated.title == "買い出し（大型スーパー）"

    def test_private_event_cannot_be_updated_by_other_user(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """プライベート予定（is_private=True）は作成者以外は編集不可 (403)."""
        now = datetime.now(JST)
        existing = Event(
            id=uuid4(),
            created_by=USER_ID_A,
            title="私用",
            start_at=now,
            end_at=now + timedelta(hours=1),
            is_private=True,
        )
        mock_event_repo.get_by_id.return_value = existing

        with pytest.raises(AuthorizationException):
            service.update_event(
                existing.id,
                EventUpdate(title="タイトル変更"),
                user_id=USER_ID_B,  # 別ユーザー
            )

    def test_update_event_clear_nullable_fields(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """description と location を None でクリアできる."""
        now = datetime.now(JST)
        existing = Event(
            id=uuid4(),
            created_by=USER_ID_A,
            title="メモあり予定",
            description="以前のメモ",
            location="以前の場所",
            start_at=now,
            end_at=now + timedelta(hours=1),
            is_private=False,
        )
        mock_event_repo.get_by_id.return_value = existing
        mock_event_repo.save.side_effect = lambda e: e

        updated = service.update_event(
            existing.id,
            EventUpdate(description=None, location=None),
            user_id=USER_ID_A,
        )
        assert updated.description is None
        assert updated.location is None


class TestEventServiceDeleteEvent:
    """delete_event のテスト."""

    def test_shared_event_can_be_deleted_by_other_user(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """家族共有予定は別ユーザーでも論理削除できる."""
        now = datetime.now(JST)
        existing = Event(
            id=uuid4(),
            created_by=USER_ID_A,
            title="共有予定",
            start_at=now,
            end_at=now + timedelta(hours=1),
            is_private=False,
        )
        mock_event_repo.get_by_id.return_value = existing
        mock_event_repo.save.side_effect = lambda e: e

        deleted = service.delete_event(existing.id, user_id=USER_ID_B)
        assert deleted.deleted_at is not None

    def test_private_event_cannot_be_deleted_by_other_user(
        self, service: EventService, mock_event_repo: MagicMock
    ) -> None:
        """プライベート予定は作成者以外は削除不可."""
        now = datetime.now(JST)
        existing = Event(
            id=uuid4(),
            created_by=USER_ID_A,
            title="プライベート予定",
            start_at=now,
            end_at=now + timedelta(hours=1),
            is_private=True,
        )
        mock_event_repo.get_by_id.return_value = existing

        with pytest.raises(AuthorizationException):
            service.delete_event(existing.id, user_id=USER_ID_B)
