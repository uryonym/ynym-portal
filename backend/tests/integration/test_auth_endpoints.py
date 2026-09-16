"""Auth エンドポイント統合テスト."""

from fastapi.testclient import TestClient

from app.main import app
from app.security.deps import get_current_user


def test_get_current_auth_user_me(client: TestClient):
    """ログイン済みユーザーの認証情報取得."""
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "テストユーザー"
    assert data["is_admin"] is True


def test_get_current_auth_user_me_unauthorized(client: TestClient):
    """未認証状態で /api/auth/me を呼び出すと 401 が返る."""
    app.dependency_overrides.pop(get_current_user, None)
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_logout(client: TestClient):
    """ログアウトで access_token Cookie が削除される."""
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully logged out"

    # Set-Cookie ヘッダーで access_token が削除される設定になっているか確認
    set_cookie = response.headers.get("set-cookie", "")
    assert "access_token=" in set_cookie
    assert "max-age=0" in set_cookie.lower() or "expires=" in set_cookie.lower()


def test_google_login_redirect(client: TestClient):
    """Google ログイン開始時にリダイレクトと oauth_state Cookie がセットされる."""
    response = client.get("/api/auth/google/login", follow_redirects=False)
    assert response.status_code == 307
    assert "accounts.google.com" in response.headers.get("location", "")
    assert "oauth_state" in response.cookies


def test_google_login_safe_redirect_to(client: TestClient):
    """安全な相対パスの redirect_to を指定した場合、oauth_redirect Cookie がセットされる."""
    response = client.get(
        "/api/auth/google/login?redirect_to=/tasks", follow_redirects=False
    )
    assert response.status_code == 307
    oauth_redirect = response.cookies.get("oauth_redirect")
    assert oauth_redirect is not None
    assert oauth_redirect.strip('"') == "/tasks"


def test_google_login_unsafe_redirect_to_ignored(client: TestClient):
    """安全でない URL（オープンリダイレクト脆弱性）の redirect_to は無視される."""
    response = client.get(
        "/api/auth/google/login?redirect_to=https://evil.com", follow_redirects=False
    )
    assert response.status_code == 307
    assert "oauth_redirect" not in response.cookies

    response2 = client.get(
        "/api/auth/google/login?redirect_to=//evil.com", follow_redirects=False
    )
    assert response2.status_code == 307
    assert "oauth_redirect" not in response2.cookies


def test_google_callback_invalid_state(client: TestClient):
    """oauth_state が不一致の場合、400 エラーを返す."""
    client.cookies.set("oauth_state", "actual_state")
    response = client.get(
        "/api/auth/google/callback?code=fake_code&state=mismatched_state",
        follow_redirects=False,
    )
    assert response.status_code == 400
    assert "possible CSRF attack" in response.json()["detail"]
