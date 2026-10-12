"""カレンダー予定エンドポイント統合テスト."""

from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.event import Event
from app.models.user import User
from app.security.deps import get_current_user

JST = timezone(timedelta(hours=9))

USER_A_ID = UUID("550e8400-e29b-41d4-a716-446655440000")
USER_B_ID = UUID("660e8400-e29b-41d4-a716-446655440001")


def _user_a() -> User:
    return User(
        id=USER_A_ID,
        google_uid="google_test_uid_a",
        email="user_a@example.com",
        name="ユーザーA",
        color="#3b82f6",
        is_admin=False,
    )


def _user_b() -> User:
    return User(
        id=USER_B_ID,
        google_uid="google_test_uid_b",
        email="user_b@example.com",
        name="ユーザーB",
        color="#ec4899",
        is_admin=False,
    )


def test_create_and_get_event(client: TestClient, db_session: Session) -> None:
    """予定を作成し詳細を取得できる."""
    # ユーザーをDBに登録
    user_a = _user_a()
    db_session.add(user_a)
    db_session.commit()

    now = datetime.now(JST)
    payload = {
        "title": "家族会議",
        "description": "議題：来期の予定",
        "location": "自宅",
        "start_at": now.isoformat(),
        "end_at": (now + timedelta(hours=1)).isoformat(),
        "is_all_day": False,
        "is_private": False,
        "participant_ids": [str(USER_A_ID)],
    }

    res = client.post("/api/events", json=payload)
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["title"] == "家族会議"
    assert data["is_private"] is False
    assert len(data["participants"]) == 1
    assert data["participants"][0]["id"] == str(USER_A_ID)

    event_id = data["id"]
    get_res = client.get(f"/api/events/{event_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == event_id


def test_list_events_shared_and_private_visibility(
    client: TestClient, db_session: Session
) -> None:
    """共有予定は全員に見え、プライベート予定は作成者本人のみに見える."""
    user_a = _user_a()
    user_b = _user_b()
    db_session.add_all([user_a, user_b])
    db_session.commit()

    now = datetime.now(JST)
    # Aの共有予定
    event_shared = Event(
        created_by=USER_A_ID,
        title="家族共有予定",
        start_at=now,
        end_at=now + timedelta(hours=2),
        is_private=False,
    )
    # Aのプライベート予定
    event_private_a = Event(
        created_by=USER_A_ID,
        title="Aのプライベート予定",
        start_at=now,
        end_at=now + timedelta(hours=2),
        is_private=True,
    )
    # Bのプライベート予定
    event_private_b = Event(
        created_by=USER_B_ID,
        title="Bのプライベート予定",
        start_at=now,
        end_at=now + timedelta(hours=2),
        is_private=True,
    )
    db_session.add_all([event_shared, event_private_a, event_private_b])
    db_session.commit()

    start_param = (now - timedelta(days=1)).isoformat()
    end_param = (now + timedelta(days=1)).isoformat()

    # ユーザーAで一覧取得（デフォルトの client fixture はユーザーA）
    res_a = client.get("/api/events", params={"start": start_param, "end": end_param})
    assert res_a.status_code == 200
    titles_a = [e["title"] for e in res_a.json()["data"]]
    assert "家族共有予定" in titles_a
    assert "Aのプライベート予定" in titles_a
    assert "Bのプライベート予定" not in titles_a  # Bのプライベートは見えない

    # ユーザーBに切り替えて一覧取得
    app.dependency_overrides[get_current_user] = _user_b
    try:
        res_b = client.get(
            "/api/events", params={"start": start_param, "end": end_param}
        )
        assert res_b.status_code == 200
        titles_b = [e["title"] for e in res_b.json()["data"]]
        assert "家族共有予定" in titles_b
        assert "Aのプライベート予定" not in titles_b  # Aのプライベートは見えない
        assert "Bのプライベート予定" in titles_b
    finally:
        app.dependency_overrides[get_current_user] = _user_a


def test_update_shared_event_by_other_user(
    client: TestClient, db_session: Session
) -> None:
    """共有予定は他ユーザーでも更新できる."""
    user_a = _user_a()
    user_b = _user_b()
    db_session.add_all([user_a, user_b])
    db_session.commit()

    now = datetime.now(JST)
    event = Event(
        created_by=USER_A_ID,
        title="夕飯の準備",
        start_at=now,
        end_at=now + timedelta(hours=1),
        is_private=False,
    )
    db_session.add(event)
    db_session.commit()

    # ユーザーBとして更新
    app.dependency_overrides[get_current_user] = _user_b
    try:
        res = client.put(
            f"/api/events/{event.id}",
            json={"title": "カレーに変更"},
        )
        assert res.status_code == 200
        assert res.json()["data"]["title"] == "カレーに変更"
    finally:
        app.dependency_overrides[get_current_user] = _user_a


def test_cannot_update_or_delete_other_users_private_event(
    client: TestClient, db_session: Session
) -> None:
    """他ユーザーのプライベート予定は編集・削除できない."""
    user_a = _user_a()
    user_b = _user_b()
    db_session.add_all([user_a, user_b])
    db_session.commit()

    now = datetime.now(JST)
    event_private_a = Event(
        created_by=USER_A_ID,
        title="Aの秘密予定",
        start_at=now,
        end_at=now + timedelta(hours=1),
        is_private=True,
    )
    db_session.add(event_private_a)
    db_session.commit()

    # ユーザーBとしてアクセス
    app.dependency_overrides[get_current_user] = _user_b
    try:
        # 詳細取得は 404（権限フィルタで存在しない扱い）
        get_res = client.get(f"/api/events/{event_private_a.id}")
        assert get_res.status_code == 404

        # 更新も 404
        put_res = client.put(
            f"/api/events/{event_private_a.id}",
            json={"title": "乗っ取り"},
        )
        assert put_res.status_code == 404

        # 削除も 404
        del_res = client.delete(f"/api/events/{event_private_a.id}")
        assert del_res.status_code == 404
    finally:
        app.dependency_overrides[get_current_user] = _user_a


def test_delete_shared_event(client: TestClient, db_session: Session) -> None:
    """共有予定を論理削除できる."""
    user_a = _user_a()
    db_session.add(user_a)
    db_session.commit()

    now = datetime.now(JST)
    event = Event(
        created_by=USER_A_ID,
        title="ゴミ出し",
        start_at=now,
        end_at=now + timedelta(hours=1),
        is_private=False,
    )
    db_session.add(event)
    db_session.commit()

    res = client.delete(f"/api/events/{event.id}")
    assert res.status_code == 204

    # 削除後は取得不可
    get_res = client.get(f"/api/events/{event.id}")
    assert get_res.status_code == 404
