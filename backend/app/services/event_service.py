"""予定管理サービス層."""

from datetime import datetime
from uuid import UUID

from app.models.base import JST
from app.models.event import Event
from app.repositories.event_repository import EventRepository
from app.repositories.user_repository import UserRepository
from app.schemas.event import EventCreate, EventUpdate
from app.utils.exceptions import (
    AuthorizationException,
    NotFoundException,
    ValidationException,
)


class EventService:
    """予定管理ビジネスロジック層."""

    def __init__(self, event_repo: EventRepository, user_repo: UserRepository) -> None:
        self.event_repo = event_repo
        self.user_repo = user_repo

    def list_events(
        self,
        start: datetime,
        end: datetime,
        user_id: UUID,
        member_ids: list[UUID] | None = None,
    ) -> list[Event]:
        """期間内の予定一覧を取得.

        - 期間の整合性・最大長（93日）をチェック
        - 家族共有予定または本人のプライベート予定を取得
        """
        if end <= start:
            raise ValidationException("終了日時は開始日時より後である必要があります")

        duration_days = (end - start).total_seconds() / 86400
        if duration_days > 93:
            raise ValidationException("取得期間は最大93日までです")

        return self.event_repo.list_in_range(
            start_at=start,
            end_at=end,
            user_id=user_id,
            member_ids=member_ids,
        )

    def get_event(self, event_id: UUID, user_id: UUID) -> Event:
        """予定を ID で取得."""
        event = self.event_repo.get_by_id(event_id, user_id)
        if not event:
            raise NotFoundException(f"予定 ID {event_id} が見つかりません")
        return event

    def create_event(self, payload: EventCreate, user_id: UUID) -> Event:
        """新規予定を作成."""
        participants = []
        if payload.participant_ids:
            participants = self.user_repo.get_by_ids(payload.participant_ids)
            if len(participants) != len(payload.participant_ids):
                raise NotFoundException("指定された参加者の一部が存在しません")

        event = Event(
            created_by=user_id,
            title=payload.title,
            description=payload.description,
            location=payload.location,
            start_at=payload.start_at,
            end_at=payload.end_at,
            is_all_day=payload.is_all_day,
            is_private=payload.is_private,
        )
        event.participants = participants
        return self.event_repo.save(event)

    def update_event(
        self, event_id: UUID, payload: EventUpdate, user_id: UUID
    ) -> Event:
        """予定を更新."""
        event = self.get_event(event_id, user_id)

        # プライベート予定の権限チェック
        if event.is_private and event.created_by != user_id:
            raise AuthorizationException("プライベート予定は作成者本人のみ編集できます")
        if payload.is_private is True and event.created_by != user_id:
            raise AuthorizationException(
                "プライベート予定への変更は作成者本人のみ可能です"
            )

        # 日時バリデーション
        new_start = payload.start_at if payload.start_at is not None else event.start_at
        new_end = payload.end_at if payload.end_at is not None else event.end_at
        if new_end <= new_start:
            raise ValidationException("終了日時は開始日時より後である必要があります")

        update_data = payload.model_dump(exclude_unset=True)

        # フィールド更新
        if "title" in update_data and update_data["title"] is not None:
            event.title = update_data["title"]
        if "description" in update_data:
            event.description = update_data["description"]
        if "location" in update_data:
            event.location = update_data["location"]
        if "start_at" in update_data and update_data["start_at"] is not None:
            event.start_at = update_data["start_at"]
        if "end_at" in update_data and update_data["end_at"] is not None:
            event.end_at = update_data["end_at"]
        if "is_all_day" in update_data and update_data["is_all_day"] is not None:
            event.is_all_day = update_data["is_all_day"]
        if "is_private" in update_data and update_data["is_private"] is not None:
            event.is_private = update_data["is_private"]

        # 参加者更新
        if payload.participant_ids is not None:
            participants = self.user_repo.get_by_ids(payload.participant_ids)
            if len(participants) != len(payload.participant_ids):
                raise NotFoundException("指定された参加者の一部が存在しません")
            event.participants = participants

        return self.event_repo.save(event)

    def delete_event(self, event_id: UUID, user_id: UUID) -> Event:
        """予定を論理削除."""
        event = self.get_event(event_id, user_id)

        if event.is_private and event.created_by != user_id:
            raise AuthorizationException("プライベート予定は作成者本人のみ削除できます")

        event.deleted_at = datetime.now(JST)
        return self.event_repo.save(event)
