"""カレンダー予定リポジトリ."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import asc, desc, func, or_, select
from sqlalchemy.orm import selectinload

from app.models.event import Event
from app.models.user import User
from app.repositories.base import BaseRepository


class EventRepository(BaseRepository[Event]):
    """予定に関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, Event)

    def list_in_range(
        self,
        start_at: datetime,
        end_at: datetime,
        user_id: UUID,
        member_ids: list[UUID] | None = None,
    ) -> list[Event]:
        """期間内の予定一覧を取得.

        - 論理削除されていないこと
        - 家族共有（is_private=False）または作成者が自分
        - start_at < end_at かつ end_at > start_at で期間重なり判定
        - member_ids が指定されている場合、参加者に含まれるか家族全員（参加者0名）の予定
        """
        stmt = (
            select(Event)
            .where(Event.deleted_at.is_(None))
            .where(or_(Event.is_private.is_(False), Event.created_by == user_id))
            .where(Event.start_at < end_at)
            .where(Event.end_at > start_at)
            .options(selectinload(Event.participants))
        )

        if member_ids:
            stmt = stmt.where(
                or_(
                    Event.participants.any(User.id.in_(member_ids)),
                    ~Event.participants.any(),
                )
            )

        stmt = stmt.order_by(asc(Event.start_at), asc(Event.end_at))
        return list(self.session.execute(stmt).scalars().all())

    def get_by_id(self, event_id: UUID, user_id: UUID) -> Event | None:
        """ID とアクセス権限（共有または本人）で予定を取得."""
        stmt = (
            select(Event)
            .where(Event.id == event_id)
            .where(Event.deleted_at.is_(None))
            .where(or_(Event.is_private.is_(False), Event.created_by == user_id))
            .options(selectinload(Event.participants))
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def get_deleted_by_id_and_user(self, event_id: UUID, user_id: UUID) -> Event | None:
        """ゴミ箱内の予定を取得（共有または本人）."""
        stmt = (
            select(Event)
            .where(Event.id == event_id)
            .where(Event.deleted_at.is_not(None))
            .where(or_(Event.is_private.is_(False), Event.created_by == user_id))
            .options(selectinload(Event.participants))
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def list_deleted_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Event]:
        """ゴミ箱内の予定一覧を取得（削除日時降順）."""
        stmt = (
            select(Event)
            .where(Event.deleted_at.is_not(None))
            .where(or_(Event.is_private.is_(False), Event.created_by == user_id))
            .options(selectinload(Event.participants))
            .order_by(desc(Event.deleted_at))
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_deleted_by_user(self, user_id: UUID) -> int:
        """ゴミ箱内の予定件数を取得."""
        stmt = (
            select(func.count())
            .select_from(Event)
            .where(Event.deleted_at.is_not(None))
            .where(or_(Event.is_private.is_(False), Event.created_by == user_id))
        )
        return self.session.execute(stmt).scalar_one()
