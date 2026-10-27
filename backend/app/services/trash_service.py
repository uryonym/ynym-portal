"""ゴミ箱機能ビジネスロジック層."""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any
from uuid import UUID

from app.repositories.event_repository import EventRepository
from app.repositories.fuel_record_repository import FuelRecordRepository
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.trash import TrashSummary
from app.utils.exceptions import ConflictException, NotFoundException


@dataclass
class TrashResourceHandler:
    """リソースごとのゴミ箱処理ハンドラー."""

    name_ja: str
    repo: Any
    validate_restore: Callable[[Any, UUID], None] | None = None
    before_purge: Callable[[Any, UUID], None] | None = None


class TrashService:
    """ゴミ箱管理サービス層."""

    def __init__(
        self,
        task_repo: TaskRepository,
        note_repo: NoteRepository,
        note_category_repo: NoteCategoryRepository,
        vehicle_repo: VehicleRepository,
        fuel_record_repo: FuelRecordRepository,
        event_repo: EventRepository | None = None,
    ) -> None:
        self.task_repo = task_repo
        self.note_repo = note_repo
        self.note_category_repo = note_category_repo
        self.vehicle_repo = vehicle_repo
        self.fuel_record_repo = fuel_record_repo
        self.event_repo = event_repo

        self._handlers: dict[str, TrashResourceHandler] = {
            "tasks": TrashResourceHandler(
                name_ja="タスク",
                repo=self.task_repo,
            ),
            "note_categories": TrashResourceHandler(
                name_ja="ノートカテゴリ",
                repo=self.note_category_repo,
                before_purge=self._before_purge_note_category,
            ),
            "notes": TrashResourceHandler(
                name_ja="ノート",
                repo=self.note_repo,
                validate_restore=self._validate_restore_note,
            ),
            "vehicles": TrashResourceHandler(
                name_ja="車両",
                repo=self.vehicle_repo,
                before_purge=self._before_purge_vehicle,
            ),
            "fuel_records": TrashResourceHandler(
                name_ja="燃費記録",
                repo=self.fuel_record_repo,
                validate_restore=self._validate_restore_fuel_record,
            ),
        }
        if self.event_repo:
            self._handlers["events"] = TrashResourceHandler(
                name_ja="予定",
                repo=self.event_repo,
            )

    def _validate_restore_note(self, note: Any, user_id: UUID) -> None:
        """ノート復元前の検証: 親カテゴリがゴミ箱に入っていないか."""
        if note.category_id:
            category = self.note_category_repo.get_by_id_including_deleted(
                note.category_id, user_id
            )
            if not category or category.deleted_at is not None:
                raise ConflictException(
                    "所属カテゴリがゴミ箱に入っているため、先にカテゴリを復元してください"
                )

    def _validate_restore_fuel_record(self, record: Any, user_id: UUID) -> None:
        """燃費記録復元前の検証: 親車両がゴミ箱に入っていないか."""
        vehicle = self.vehicle_repo.get_by_id_including_deleted(
            record.vehicle_id, user_id
        )
        if not vehicle or vehicle.deleted_at is not None:
            raise ConflictException(
                "親の車両がゴミ箱に入っているため、先に車両を復元してください"
            )

    def _before_purge_note_category(self, category: Any, user_id: UUID) -> None:
        """ノートカテゴリ物理削除前: 紐づくノートの category_id を NULL に更新."""
        self.note_repo.nullify_category(user_id, category.id)

    def _before_purge_vehicle(self, vehicle: Any, user_id: UUID) -> None:
        """車両物理削除前: 紐づく燃費記録が存在する場合は削除不可."""
        if (
            self.fuel_record_repo.count_by_vehicle_including_deleted(
                user_id, vehicle.id
            )
            > 0
        ):
            raise ConflictException(
                "関連する給油記録が存在するため完全削除できません。先に給油記録を完全削除してください"
            )

    def _get_handler(self, resource_type: str) -> TrashResourceHandler:
        """リソースハンドラーを取得（未知のリソース種別の場合は NotFoundException）."""
        handler = self._handlers.get(resource_type)
        if not handler:
            raise NotFoundException(f"未知のリソース種別です: {resource_type}")
        return handler

    def get_summary(self, user_id: UUID) -> TrashSummary:
        """各リソースのゴミ箱件数と合計を取得."""
        tasks = self.task_repo.count_deleted_by_user(user_id)
        notes = self.note_repo.count_deleted_by_user(user_id)
        note_categories = self.note_category_repo.count_deleted_by_user(user_id)
        vehicles = self.vehicle_repo.count_deleted_by_user(user_id)
        fuel_records = self.fuel_record_repo.count_deleted_by_user(user_id)
        events = (
            self.event_repo.count_deleted_by_user(user_id) if self.event_repo else 0
        )
        total = tasks + notes + note_categories + vehicles + fuel_records + events

        return TrashSummary(
            tasks=tasks,
            notes=notes,
            note_categories=note_categories,
            vehicles=vehicles,
            fuel_records=fuel_records,
            events=events,
            total=total,
        )

    def list_items(
        self,
        resource_type: str,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Any]:
        """指定リソースのゴミ箱一覧を取得."""
        handler = self._get_handler(resource_type)
        return handler.repo.list_deleted_by_user(user_id, skip, limit)

    def restore_item(
        self,
        resource_type: str,
        item_id: UUID,
        user_id: UUID,
    ) -> Any:
        """論理削除されたデータを復元."""
        handler = self._get_handler(resource_type)
        item = handler.repo.get_deleted_by_id_and_user(item_id, user_id)
        if not item:
            raise NotFoundException(
                f"ゴミ箱に{handler.name_ja} ID {item_id} が見つかりません"
            )

        if handler.validate_restore:
            handler.validate_restore(item, user_id)

        item.deleted_at = None
        return handler.repo.save(item)

    def purge_item(
        self,
        resource_type: str,
        item_id: UUID,
        user_id: UUID,
    ) -> None:
        """論理削除されたデータを物理削除（完全削除）."""
        handler = self._get_handler(resource_type)
        item = handler.repo.get_deleted_by_id_and_user(item_id, user_id)
        if not item:
            raise NotFoundException(
                f"ゴミ箱に{handler.name_ja} ID {item_id} が見つかりません"
            )

        if handler.before_purge:
            handler.before_purge(item, user_id)

        handler.repo.delete(item)

    def empty_trash(self, resource_type: str, user_id: UUID) -> int:
        """指定リソースのゴミ箱を全件完全削除 (N+1 クエリを解消して一括削除).

        Returns:
            削除された件数
        """
        handler = self._get_handler(resource_type)
        items = handler.repo.list_deleted_by_user(user_id, skip=0, limit=1000)
        count = len(items)
        if count == 0:
            return 0

        # 削除前の依存関係チェック・前処理
        for item in items:
            if handler.before_purge:
                handler.before_purge(item, user_id)
            handler.repo.delete(item)

        return count
