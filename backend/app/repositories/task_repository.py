"""タスクリポジトリ."""

from uuid import UUID

from sqlalchemy import asc, func, select
from sqlalchemy.sql import nulls_last

from app.models.task import Task
from app.repositories.base import BaseRepository


class TaskRepository(BaseRepository[Task]):
    """タスクに関するデータアクセスを担う."""

    def __init__(self, session) -> None:
        super().__init__(session, Task)

    def list_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
        is_completed: bool | None = None,
    ) -> list[Task]:
        """ユーザーのタスク一覧を取得（期日昇順、期日なしは末尾）."""
        stmt = (
            select(Task).where(Task.user_id == user_id).where(Task.deleted_at.is_(None))
        )
        if is_completed is not None:
            stmt = stmt.where(Task.is_completed == is_completed)
        stmt = (
            stmt.order_by(
                nulls_last(asc(Task.due_date)),
                asc(Task.created_at),
            )
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def get_by_id_and_user(self, task_id: UUID, user_id: UUID) -> Task | None:
        """task_id と user_id でタスクを取得（所有権確認）."""
        stmt = (
            select(Task)
            .where(Task.id == task_id)
            .where(Task.user_id == user_id)
            .where(Task.deleted_at.is_(None))
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def list_deleted_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Task]:
        """論理削除されたタスク一覧を取得（削除日時降順）."""
        stmt = (
            select(Task)
            .where(Task.user_id == user_id)
            .where(Task.deleted_at.is_not(None))
            .order_by(Task.deleted_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_deleted_by_user(self, user_id: UUID) -> int:
        """論理削除されたタスクの総件数を取得."""
        stmt = (
            select(func.count())
            .select_from(Task)
            .where(Task.user_id == user_id)
            .where(Task.deleted_at.is_not(None))
        )
        return self.session.execute(stmt).scalar() or 0

    def get_deleted_by_id_and_user(self, task_id: UUID, user_id: UUID) -> Task | None:
        """task_id と user_id で論理削除されたタスクを取得."""
        stmt = (
            select(Task)
            .where(Task.id == task_id)
            .where(Task.user_id == user_id)
            .where(Task.deleted_at.is_not(None))
        )
        return self.session.execute(stmt).scalars().one_or_none()
