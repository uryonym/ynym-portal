"""UserService 単体テスト."""

import pytest
from fastapi import HTTPException

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate
from app.services.user_service import UserService


@pytest.fixture
def user_service(db_session):
    return UserService(UserRepository(db_session))


def test_create_user_success(user_service):
    user_in = UserCreate(
        google_uid="google_uid_001",
        email="user1@example.com",
        name="User One",
        is_admin=False,
    )
    user = user_service.create_user(user_in)
    assert user.id is not None
    assert user.google_uid == "google_uid_001"
    assert user.email == "user1@example.com"
    assert user.name == "User One"
    assert user.is_admin is False
    assert user.deleted_at is None


def test_create_user_duplicate_google_uid(user_service):
    user_in = UserCreate(
        google_uid="google_uid_dup",
        email="user_dup1@example.com",
        name="User Dup 1",
    )
    user_service.create_user(user_in)

    with pytest.raises(HTTPException) as exc_info:
        user_service.create_user(
            UserCreate(
                google_uid="google_uid_dup",
                email="user_dup2@example.com",
                name="User Dup 2",
            )
        )
    assert exc_info.value.status_code == 400
    assert "Google UID" in exc_info.value.detail


def test_create_user_duplicate_email(user_service):
    user_in = UserCreate(
        google_uid="google_uid_email_1",
        email="user_same_email@example.com",
        name="User 1",
    )
    user_service.create_user(user_in)

    with pytest.raises(HTTPException) as exc_info:
        user_service.create_user(
            UserCreate(
                google_uid="google_uid_email_2",
                email="user_same_email@example.com",
                name="User 2",
            )
        )
    assert exc_info.value.status_code == 400
    assert "メールアドレス" in exc_info.value.detail


def test_update_user_success(user_service):
    user = user_service.create_user(
        UserCreate(
            google_uid="google_uid_upd",
            email="upd@example.com",
            name="Before Update",
        )
    )
    updated = user_service.update_user(
        user.id,
        UserUpdate(name="After Update", is_admin=True),
    )
    assert updated.name == "After Update"
    assert updated.is_admin is True


def test_delete_user_soft_delete(user_service):
    user = user_service.create_user(
        UserCreate(
            google_uid="google_uid_del",
            email="del@example.com",
            name="To Delete",
        )
    )
    deleted = user_service.delete_user(user.id)
    assert deleted.deleted_at is not None

    # 通常の取得では None になる
    assert user_service.get_by_id(user.id) is None
    # include_deleted=True では取得できる
    assert user_service.get_by_id(user.id, include_deleted=True) is not None

    # 二重削除はエラー
    with pytest.raises(HTTPException) as exc_info:
        user_service.delete_user(user.id)
    assert exc_info.value.status_code == 400


def test_restore_user_success(user_service):
    user = user_service.create_user(
        UserCreate(
            google_uid="google_uid_rest",
            email="rest@example.com",
            name="To Restore",
        )
    )
    user_service.delete_user(user.id)
    assert user_service.get_by_id(user.id) is None

    restored = user_service.restore_user(user.id)
    assert restored.deleted_at is None
    assert user_service.get_by_id(user.id) is not None


def test_list_and_count_users(user_service):
    u1 = user_service.create_user(
        UserCreate(
            google_uid="uid_list_1",
            email="list1@example.com",
            name="Alpha User",
        )
    )
    u2 = user_service.create_user(
        UserCreate(
            google_uid="uid_list_2",
            email="list2@example.com",
            name="Beta User",
        )
    )
    user_service.delete_user(u2.id)

    # 有効なユーザーのみ
    active_users = user_service.list_users(include_deleted=False)
    active_ids = [u.id for u in active_users]
    assert u1.id in active_ids
    assert u2.id not in active_ids

    # 削除済み含む
    all_users = user_service.list_users(include_deleted=True)
    all_ids = [u.id for u in all_users]
    assert u1.id in all_ids
    assert u2.id in all_ids

    # 検索
    searched = user_service.list_users(search="Alpha")
    assert any(u.name == "Alpha User" for u in searched)


def test_sync_google_user(user_service):
    user = user_service.create_user(
        UserCreate(
            google_uid="uid_sync",
            email="sync_before@example.com",
            name="Sync Before",
        )
    )
    synced = user_service.sync_google_user(
        user=user,
        name="Sync After",
        email="sync_after@example.com",
        avatar_url="https://example.com/photo.jpg",
    )
    assert synced.name == "Sync After"
    assert synced.email == "sync_after@example.com"
    assert synced.avatar_url == "https://example.com/photo.jpg"
