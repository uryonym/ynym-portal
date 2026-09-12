"""Userエンドポイント統合テスト."""

from datetime import datetime
from uuid import UUID, uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.models.base import JST
from app.models.user import User
from app.security.deps import get_current_admin_user, get_current_user


def _admin_user() -> User:
    return User(
        id=UUID("550e8400-e29b-41d4-a716-446655440000"),
        google_uid="admin_google_uid",
        email="admin@example.com",
        name="管理者ユーザー",
        avatar_url=None,
        is_admin=True,
        deleted_at=None,
        created_at=datetime.now(JST),
        updated_at=datetime.now(JST),
    )


def _regular_user() -> User:
    return User(
        id=UUID("550e8400-e29b-41d4-a716-446655440001"),
        google_uid="regular_google_uid",
        email="regular@example.com",
        name="一般ユーザー",
        avatar_url=None,
        is_admin=False,
        deleted_at=None,
        created_at=datetime.now(JST),
        updated_at=datetime.now(JST),
    )


def test_get_current_user_me(client: TestClient):
    response = client.get("/api/users/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["is_admin"] is True


def test_admin_list_users(client: TestClient):
    app.dependency_overrides[get_current_user] = _admin_user
    app.dependency_overrides[get_current_admin_user] = _admin_user

    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)


def test_regular_user_cannot_access_user_management(client: TestClient):
    app.dependency_overrides[get_current_user] = _regular_user
    # get_current_admin_user は通常依存関数を動かす（_regular_user で 403 になるはず）
    app.dependency_overrides.pop(get_current_admin_user, None)

    response = client.get("/api/users")
    assert response.status_code == 403


def test_admin_create_and_delete_user(client: TestClient):
    app.dependency_overrides[get_current_user] = _admin_user
    app.dependency_overrides[get_current_admin_user] = _admin_user

    # 1. ユーザー作成
    create_payload = {
        "google_uid": f"new_google_uid_{uuid4().hex[:8]}",
        "email": f"new_{uuid4().hex[:8]}@example.com",
        "name": "新規登録ユーザー",
        "is_admin": False,
    }
    create_res = client.post("/api/users", json=create_payload)
    assert create_res.status_code == 201
    created_user = create_res.json()["data"]
    user_id = created_user["id"]
    assert created_user["google_uid"] == create_payload["google_uid"]

    # 2. ユーザー取得
    get_res = client.get(f"/api/users/{user_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["name"] == "新規登録ユーザー"

    # 3. ユーザー更新
    update_res = client.put(
        f"/api/users/{user_id}",
        json={"name": "名前変更ユーザー", "is_admin": True},
    )
    assert update_res.status_code == 200
    assert update_res.json()["data"]["name"] == "名前変更ユーザー"
    assert update_res.json()["data"]["is_admin"] is True

    # 4. ユーザー論理削除
    del_res = client.delete(f"/api/users/{user_id}")
    assert del_res.status_code == 204

    # 5. 削除済み状態の確認（一覧ではデフォルトで出ない）
    list_active = client.get("/api/users")
    active_ids = [u["id"] for u in list_active.json()["data"]]
    assert user_id not in active_ids

    # include_deleted=true では出る
    list_deleted = client.get("/api/users?include_deleted=true")
    deleted_ids = [u["id"] for u in list_deleted.json()["data"]]
    assert user_id in deleted_ids

    # 6. ユーザー復元
    restore_res = client.post(f"/api/users/{user_id}/restore")
    assert restore_res.status_code == 200
    assert restore_res.json()["data"]["deleted_at"] is None


def test_admin_cannot_delete_self(client: TestClient):
    app.dependency_overrides[get_current_user] = _admin_user
    app.dependency_overrides[get_current_admin_user] = _admin_user

    admin = _admin_user()
    del_res = client.delete(f"/api/users/{admin.id}")
    assert del_res.status_code == 400
    assert "自分自身" in del_res.json()["detail"]
