"""リポジトリ基底クラス."""

from uuid import UUID

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
