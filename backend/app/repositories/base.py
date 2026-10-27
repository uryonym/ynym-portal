"""リポジトリ基底クラス."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session


class BaseRepository[T]:
    """汎用リポジトリ基底クラス."""

    def __init__(self, session: Session, model: type[T]) -> None:
        self.session = session
        self.model = model

    def get_by_id(self, id: UUID) -> T | None:
        """ID でエンティティを取得."""
        return self.session.get(self.model, id)

    def save(self, entity: T) -> T:
        """エンティティを永続化（add & flush）してリフレッシュ."""
        self.session.add(entity)
        self.session.flush()
        self.session.refresh(entity)
        return entity

    def delete(self, entity: T) -> None:
        """エンティティを物理削除（flush）."""
        self.session.delete(entity)
        self.session.flush()


class UserOwnedSoftDeleteRepository[T](BaseRepository[T]):
    """ユーザー所有かつ論理削除対応モデル向けリポジトリ基底クラス."""

    def get_by_id_and_user(
        self,
        entity_id: UUID,
        user_id: UUID,
        include_deleted: bool = False,
    ) -> T | None:
        """entity_id と user_id でエンティティを取得（所有権確認）."""
        stmt = (
            select(self.model)
            .where(self.model.id == entity_id)  # type: ignore[attr-defined]
            .where(self.model.user_id == user_id)  # type: ignore[attr-defined]
        )
        if not include_deleted:
            stmt = stmt.where(self.model.deleted_at.is_(None))  # type: ignore[attr-defined]
        return self.session.execute(stmt).scalars().one_or_none()

    def get_by_id_including_deleted(
        self,
        entity_id: UUID,
        user_id: UUID,
    ) -> T | None:
        """削除状態に関わらず entity_id と user_id でエンティティを取得."""
        return self.get_by_id_and_user(entity_id, user_id, include_deleted=True)

    def get_deleted_by_id_and_user(
        self,
        entity_id: UUID,
        user_id: UUID,
    ) -> T | None:
        """entity_id と user_id で論理削除されたエンティティを取得."""
        stmt = (
            select(self.model)
            .where(self.model.id == entity_id)  # type: ignore[attr-defined]
            .where(self.model.user_id == user_id)  # type: ignore[attr-defined]
            .where(self.model.deleted_at.is_not(None))  # type: ignore[attr-defined]
        )
        return self.session.execute(stmt).scalars().one_or_none()

    def list_deleted_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[T]:
        """論理削除されたエンティティ一覧を取得（削除日時降順）."""
        stmt = (
            select(self.model)
            .where(self.model.user_id == user_id)  # type: ignore[attr-defined]
            .where(self.model.deleted_at.is_not(None))  # type: ignore[attr-defined]
            .order_by(self.model.deleted_at.desc())  # type: ignore[attr-defined]
            .offset(skip)
            .limit(limit)
        )
        return list(self.session.execute(stmt).scalars().all())

    def count_deleted_by_user(self, user_id: UUID) -> int:
        """論理削除されたエンティティの総件数を取得."""
        stmt = (
            select(func.count())
            .select_from(self.model)
            .where(self.model.user_id == user_id)  # type: ignore[attr-defined]
            .where(self.model.deleted_at.is_not(None))  # type: ignore[attr-defined]
        )
        return self.session.execute(stmt).scalar() or 0
