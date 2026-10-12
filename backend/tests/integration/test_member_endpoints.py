"""家族メンバーエンドポイント統合テスト."""

from uuid import UUID

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User

USER_ID = UUID("550e8400-e29b-41d4-a716-446655440000")


def test_list_members_and_update_color(client: TestClient, db_session: Session) -> None:
    """一般ユーザーとして家族メンバー一覧取得と自分の色更新ができる."""
    user = User(
        id=USER_ID,
        google_uid="google_uid_test",
        email="test@example.com",
        name="テストユーザー",
        color=None,
        is_admin=False,
    )
    db_session.add(user)
    db_session.commit()

    # メンバー一覧取得
    res = client.get("/api/members")
    assert res.status_code == 200
    members = res.json()["data"]
    assert len(members) >= 1
    target = next((m for m in members if m["id"] == str(USER_ID)), None)
    assert target is not None
    assert target["name"] == "テストユーザー"
    assert target["color"] is None

    # 自分の色を更新
    put_res = client.put("/api/members/me/color", json={"color": "#10b981"})
    assert put_res.status_code == 200
    assert put_res.json()["data"]["color"] == "#10b981"

    # 再度一覧取得して反映されていることを確認
    res2 = client.get("/api/members")
    target2 = next((m for m in res2.json()["data"] if m["id"] == str(USER_ID)), None)
    assert target2["color"] == "#10b981"
