"""ゴミ箱機能ビジネスロジック層."""

from typing import Any
from uuid import UUID

from app.repositories.fuel_record_repository import FuelRecordRepository
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.trash import TrashSummary
from app.utils.exceptions import ConflictException, NotFoundException


class TrashService:
    """ゴミ箱管理サービス層."""

    def __init__(
        self,
        task_repo: TaskRepository,
        note_repo: NoteRepository,
        note_category_repo: NoteCategoryRepository,
        vehicle_repo: VehicleRepository,
        fuel_record_repo: FuelRecordRepository,
    ) -> None:
        self.task_repo = task_repo
        self.note_repo = note_repo
        self.note_category_repo = note_category_repo
        self.vehicle_repo = vehicle_repo
        self.fuel_record_repo = fuel_record_repo

    def get_summary(self, user_id: UUID) -> TrashSummary:
        """各リソースのゴミ箱件数と合計を取得."""
        tasks = self.task_repo.count_deleted_by_user(user_id)
        notes = self.note_repo.count_deleted_by_user(user_id)
        note_categories = self.note_category_repo.count_deleted_by_user(user_id)
        vehicles = self.vehicle_repo.count_deleted_by_user(user_id)
        fuel_records = self.fuel_record_repo.count_deleted_by_user(user_id)
        total = tasks + notes + note_categories + vehicles + fuel_records

        return TrashSummary(
            tasks=tasks,
            notes=notes,
            note_categories=note_categories,
            vehicles=vehicles,
            fuel_records=fuel_records,
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
        match resource_type:
            case "tasks":
                return self.task_repo.list_deleted_by_user(user_id, skip, limit)
            case "notes":
                return self.note_repo.list_deleted_by_user(user_id, skip, limit)
            case "note_categories":
                return self.note_category_repo.list_deleted_by_user(
                    user_id, skip, limit
                )
            case "vehicles":
                return self.vehicle_repo.list_deleted_by_user(user_id, skip, limit)
            case "fuel_records":
                return self.fuel_record_repo.list_deleted_by_user(user_id, skip, limit)
            case _:
                raise NotFoundException(f"未知のリソース種別です: {resource_type}")

    def restore_item(
        self,
        resource_type: str,
        item_id: UUID,
        user_id: UUID,
    ) -> Any:
        """論理削除されたデータを復元."""
        match resource_type:
            case "tasks":
                task = self.task_repo.get_deleted_by_id_and_user(item_id, user_id)
                if not task:
                    raise NotFoundException(
                        f"ゴミ箱にタスク ID {item_id} が見つかりません"
                    )
                task.deleted_at = None
                return self.task_repo.save(task)

            case "note_categories":
                category = self.note_category_repo.get_deleted_by_id_and_user(
                    item_id, user_id
                )
                if not category:
                    raise NotFoundException(
                        f"ゴミ箱にノートカテゴリ ID {item_id} が見つかりません"
                    )
                category.deleted_at = None
                return self.note_category_repo.save(category)

            case "notes":
                note = self.note_repo.get_deleted_by_id_and_user(item_id, user_id)
                if not note:
                    raise NotFoundException(
                        f"ゴミ箱にノート ID {item_id} が見つかりません"
                    )
                if note.category_id:
                    category = self.note_category_repo.get_by_id_including_deleted(
                        note.category_id, user_id
                    )
                    if not category or category.deleted_at is not None:
                        raise ConflictException(
                            "所属カテゴリがゴミ箱に入っているため、先にカテゴリを復元してください"
                        )
                note.deleted_at = None
                return self.note_repo.save(note)

            case "vehicles":
                vehicle = self.vehicle_repo.get_deleted_by_id_and_user(item_id, user_id)
                if not vehicle:
                    raise NotFoundException(
                        f"ゴミ箱に車両 ID {item_id} が見つかりません"
                    )
                vehicle.deleted_at = None
                return self.vehicle_repo.save(vehicle)

            case "fuel_records":
                record = self.fuel_record_repo.get_deleted_by_id_and_user(
                    item_id, user_id
                )
                if not record:
                    raise NotFoundException(
                        f"ゴミ箱に燃費記録 ID {item_id} が見つかりません"
                    )
                vehicle = self.vehicle_repo.get_by_id_including_deleted(
                    record.vehicle_id, user_id
                )
                if not vehicle or vehicle.deleted_at is not None:
                    raise ConflictException(
                        "親の車両がゴミ箱に入っているため、先に車両を復元してください"
                    )
                record.deleted_at = None
                return self.fuel_record_repo.save(record)

            case _:
                raise NotFoundException(f"未知のリソース種別です: {resource_type}")

    def purge_item(
        self,
        resource_type: str,
        item_id: UUID,
        user_id: UUID,
    ) -> None:
        """論理削除されたデータを物理削除（完全削除）."""
        match resource_type:
            case "tasks":
                task = self.task_repo.get_deleted_by_id_and_user(item_id, user_id)
                if not task:
                    raise NotFoundException(
                        f"ゴミ箱にタスク ID {item_id} が見つかりません"
                    )
                self.task_repo.delete(task)

            case "note_categories":
                category = self.note_category_repo.get_deleted_by_id_and_user(
                    item_id, user_id
                )
                if not category:
                    raise NotFoundException(
                        f"ゴミ箱にノートカテゴリ ID {item_id} が見つかりません"
                    )
                # 紐づくノートの category_id を NULL に更新
                self.note_repo.nullify_category(user_id, item_id)
                self.note_category_repo.delete(category)

            case "notes":
                note = self.note_repo.get_deleted_by_id_and_user(item_id, user_id)
                if not note:
                    raise NotFoundException(
                        f"ゴミ箱にノート ID {item_id} が見つかりません"
                    )
                self.note_repo.delete(note)

            case "vehicles":
                vehicle = self.vehicle_repo.get_deleted_by_id_and_user(item_id, user_id)
                if not vehicle:
                    raise NotFoundException(
                        f"ゴミ箱に車両 ID {item_id} が見つかりません"
                    )
                # 紐づく燃費記録（論理削除含む）が存在する場合は完全削除不可
                if (
                    self.fuel_record_repo.count_by_vehicle_including_deleted(
                        user_id, item_id
                    )
                    > 0
                ):
                    raise ConflictException(
                        "関連する給油記録が存在するため完全削除できません。先に給油記録を完全削除してください"
                    )
                self.vehicle_repo.delete(vehicle)

            case "fuel_records":
                record = self.fuel_record_repo.get_deleted_by_id_and_user(
                    item_id, user_id
                )
                if not record:
                    raise NotFoundException(
                        f"ゴミ箱に燃費記録 ID {item_id} が見つかりません"
                    )
                self.fuel_record_repo.delete(record)

            case _:
                raise NotFoundException(f"未知のリソース種別です: {resource_type}")

    def empty_trash(self, resource_type: str, user_id: UUID) -> int:
        """指定リソースのゴミ箱を全件完全削除.

        Returns:
            削除された件数
        """
        items = self.list_items(resource_type, user_id, skip=0, limit=1000)
        count = len(items)
        for item in items:
            self.purge_item(resource_type, item.id, user_id)
        return count
