"""タスクリポジトリ."""

from datetime import date
from uuid import UUID

from sqlalchemy import asc, select
from sqlalchemy.sql import nulls_last

from app.models.task import Task
from app.repositories.base import UserOwnedSoftDeleteRepository


class TaskRepository(UserOwnedSoftDeleteRepository[Task]):
    """タスクに関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, Task)

    def list_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
        is_completed: bool | None = None,
        due_from: date | None = None,
        due_to: date | None = None,
    ) -> list[Task]:
        """ユーザーのタスク一覧を取得（期日昇順、期日なしは末尾）."""
        stmt = (
            select(Task).where(Task.user_id == user_id).where(Task.deleted_at.is_(None))
        )
        if is_completed is not None:
            stmt = stmt.where(Task.is_completed == is_completed)
        if due_from is not None:
            stmt = stmt.where(Task.due_date >= due_from)
        if due_to is not None:
            stmt = stmt.where(Task.due_date <= due_to)
        stmt = (
            stmt.order_by(
                nulls_last(asc(Task.due_date)),
                asc(Task.created_at),
            )
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())
