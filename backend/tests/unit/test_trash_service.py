"""TrashService ユニットテスト."""

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
from uuid import UUID

import pytest

from app.models.fuel_record import FuelRecord
from app.models.note import Note
from app.models.note_category import NoteCategory
from app.models.task import Task
from app.models.vehicle import Vehicle
from app.repositories.fuel_record_repository import FuelRecordRepository
from app.repositories.note_category_repository import NoteCategoryRepository
from app.repositories.note_repository import NoteRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.services.trash_service import TrashService
from app.utils.exceptions import ConflictException, NotFoundException

TEST_USER_ID = UUID("550e8400-e29b-41d4-a716-446655440000")
TEST_ITEM_ID = UUID("11111111-1111-1111-1111-111111111111")
TEST_PARENT_ID = UUID("22222222-2222-2222-2222-222222222222")
NOW = datetime.now(timezone(timedelta(hours=9)))


@pytest.fixture
def mock_repos():
    return {
        "task": MagicMock(spec=TaskRepository),
        "note": MagicMock(spec=NoteRepository),
        "note_category": MagicMock(spec=NoteCategoryRepository),
        "vehicle": MagicMock(spec=VehicleRepository),
        "fuel_record": MagicMock(spec=FuelRecordRepository),
    }


@pytest.fixture
def trash_service(mock_repos):
    return TrashService(
        task_repo=mock_repos["task"],
        note_repo=mock_repos["note"],
        note_category_repo=mock_repos["note_category"],
        vehicle_repo=mock_repos["vehicle"],
        fuel_record_repo=mock_repos["fuel_record"],
    )


# ---------------------------------------------------------------------------
# get_summary
# ---------------------------------------------------------------------------


def test_get_summary(trash_service, mock_repos):
    mock_repos["task"].count_deleted_by_user.return_value = 2
    mock_repos["note"].count_deleted_by_user.return_value = 1
    mock_repos["note_category"].count_deleted_by_user.return_value = 0
    mock_repos["vehicle"].count_deleted_by_user.return_value = 3
    mock_repos["fuel_record"].count_deleted_by_user.return_value = 4

    summary = trash_service.get_summary(TEST_USER_ID)

    assert summary.tasks == 2
    assert summary.notes == 1
    assert summary.note_categories == 0
    assert summary.vehicles == 3
    assert summary.fuel_records == 4
    assert summary.total == 10


# ---------------------------------------------------------------------------
# list_items
# ---------------------------------------------------------------------------


def test_list_items_success(trash_service, mock_repos):
    mock_repos["task"].list_deleted_by_user.return_value = ["task1"]
    res = trash_service.list_items("tasks", TEST_USER_ID, skip=0, limit=10)
    assert res == ["task1"]
    mock_repos["task"].list_deleted_by_user.assert_called_once_with(TEST_USER_ID, 0, 10)


def test_list_items_invalid_resource(trash_service):
    with pytest.raises(NotFoundException, match="未知のリソース種別です"):
        trash_service.list_items("unknown", TEST_USER_ID)


# ---------------------------------------------------------------------------
# restore_item
# ---------------------------------------------------------------------------


def test_restore_task_success(trash_service, mock_repos):
    task = MagicMock(spec=Task, id=TEST_ITEM_ID, user_id=TEST_USER_ID, deleted_at=NOW)
    mock_repos["task"].get_deleted_by_id_and_user.return_value = task
    mock_repos["task"].save.side_effect = lambda t: t

    restored = trash_service.restore_item("tasks", TEST_ITEM_ID, TEST_USER_ID)
    assert restored.deleted_at is None
    mock_repos["task"].save.assert_called_once_with(task)


def test_restore_task_not_found(trash_service, mock_repos):
    mock_repos["task"].get_deleted_by_id_and_user.return_value = None
    with pytest.raises(NotFoundException, match="ゴミ箱にタスク ID"):
        trash_service.restore_item("tasks", TEST_ITEM_ID, TEST_USER_ID)


def test_restore_note_with_valid_category(trash_service, mock_repos):
    note = MagicMock(
        spec=Note,
        id=TEST_ITEM_ID,
        user_id=TEST_USER_ID,
        category_id=TEST_PARENT_ID,
        deleted_at=NOW,
    )
    category = MagicMock(
        spec=NoteCategory, id=TEST_PARENT_ID, user_id=TEST_USER_ID, deleted_at=None
    )
    mock_repos["note"].get_deleted_by_id_and_user.return_value = note
    mock_repos["note_category"].get_by_id_including_deleted.return_value = category
    mock_repos["note"].save.side_effect = lambda n: n

    restored = trash_service.restore_item("notes", TEST_ITEM_ID, TEST_USER_ID)
    assert restored.deleted_at is None


def test_restore_note_conflict_parent_deleted(trash_service, mock_repos):
    note = MagicMock(
        spec=Note,
        id=TEST_ITEM_ID,
        user_id=TEST_USER_ID,
        category_id=TEST_PARENT_ID,
        deleted_at=NOW,
    )
    category = MagicMock(
        spec=NoteCategory, id=TEST_PARENT_ID, user_id=TEST_USER_ID, deleted_at=NOW
    )
    mock_repos["note"].get_deleted_by_id_and_user.return_value = note
    mock_repos["note_category"].get_by_id_including_deleted.return_value = category

    with pytest.raises(ConflictException, match="所属カテゴリがゴミ箱に入っているため"):
        trash_service.restore_item("notes", TEST_ITEM_ID, TEST_USER_ID)


def test_restore_fuel_record_conflict_parent_deleted(trash_service, mock_repos):
    record = MagicMock(
        spec=FuelRecord,
        id=TEST_ITEM_ID,
        user_id=TEST_USER_ID,
        vehicle_id=TEST_PARENT_ID,
        deleted_at=NOW,
    )
    vehicle = MagicMock(
        spec=Vehicle, id=TEST_PARENT_ID, user_id=TEST_USER_ID, deleted_at=NOW
    )
    mock_repos["fuel_record"].get_deleted_by_id_and_user.return_value = record
    mock_repos["vehicle"].get_by_id_including_deleted.return_value = vehicle

    with pytest.raises(ConflictException, match="親の車両がゴミ箱に入っているため"):
        trash_service.restore_item("fuel_records", TEST_ITEM_ID, TEST_USER_ID)


def test_restore_fuel_record_success(trash_service, mock_repos):
    record = MagicMock(
        spec=FuelRecord,
        id=TEST_ITEM_ID,
        user_id=TEST_USER_ID,
        vehicle_id=TEST_PARENT_ID,
        deleted_at=NOW,
    )
    vehicle = MagicMock(
        spec=Vehicle, id=TEST_PARENT_ID, user_id=TEST_USER_ID, deleted_at=None
    )
    mock_repos["fuel_record"].get_deleted_by_id_and_user.return_value = record
    mock_repos["vehicle"].get_by_id_including_deleted.return_value = vehicle
    mock_repos["fuel_record"].save.side_effect = lambda r: r

    restored = trash_service.restore_item("fuel_records", TEST_ITEM_ID, TEST_USER_ID)
    assert restored.deleted_at is None


# ---------------------------------------------------------------------------
# purge_item
# ---------------------------------------------------------------------------


def test_purge_task_success(trash_service, mock_repos):
    task = MagicMock(spec=Task, id=TEST_ITEM_ID, user_id=TEST_USER_ID)
    mock_repos["task"].get_deleted_by_id_and_user.return_value = task

    trash_service.purge_item("tasks", TEST_ITEM_ID, TEST_USER_ID)
    mock_repos["task"].delete.assert_called_once_with(task)


def test_purge_note_category_nullifies_notes(trash_service, mock_repos):
    category = MagicMock(spec=NoteCategory, id=TEST_ITEM_ID, user_id=TEST_USER_ID)
    mock_repos["note_category"].get_deleted_by_id_and_user.return_value = category

    trash_service.purge_item("note_categories", TEST_ITEM_ID, TEST_USER_ID)
    mock_repos["note"].nullify_category.assert_called_once_with(
        TEST_USER_ID, TEST_ITEM_ID
    )
    mock_repos["note_category"].delete.assert_called_once_with(category)


def test_purge_vehicle_conflict_with_fuel_records(trash_service, mock_repos):
    vehicle = MagicMock(spec=Vehicle, id=TEST_ITEM_ID, user_id=TEST_USER_ID)
    mock_repos["vehicle"].get_deleted_by_id_and_user.return_value = vehicle
    mock_repos["fuel_record"].count_by_vehicle_including_deleted.return_value = 2

    with pytest.raises(ConflictException, match="関連する給油記録が存在するため"):
        trash_service.purge_item("vehicles", TEST_ITEM_ID, TEST_USER_ID)


def test_purge_vehicle_success_without_fuel_records(trash_service, mock_repos):
    vehicle = MagicMock(spec=Vehicle, id=TEST_ITEM_ID, user_id=TEST_USER_ID)
    mock_repos["vehicle"].get_deleted_by_id_and_user.return_value = vehicle
    mock_repos["fuel_record"].count_by_vehicle_including_deleted.return_value = 0

    trash_service.purge_item("vehicles", TEST_ITEM_ID, TEST_USER_ID)
    mock_repos["vehicle"].delete.assert_called_once_with(vehicle)


def test_empty_trash(trash_service, mock_repos):
    task1 = MagicMock(spec=Task, id=UUID("11111111-1111-1111-1111-111111111111"))
    task2 = MagicMock(spec=Task, id=UUID("22222222-2222-2222-2222-222222222222"))
    mock_repos["task"].list_deleted_by_user.return_value = [task1, task2]
    mock_repos["task"].get_deleted_by_id_and_user.side_effect = lambda tid, uid: (
        task1 if tid == task1.id else task2
    )

    count = trash_service.empty_trash("tasks", TEST_USER_ID)
    assert count == 2
    assert mock_repos["task"].delete.call_count == 2
