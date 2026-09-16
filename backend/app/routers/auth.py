"""認証関連エンドポイント."""

import secrets
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import settings
from app.core.db import SessionDep
from app.repositories.user_repository import UserRepository
from app.schemas.base import MessageResponse
from app.schemas.user import UserResponse
from app.security.deps import CurrentUser
from app.services.auth_service import auth_service
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_user_service(db: SessionDep) -> UserService:
    return UserService(UserRepository(db))


def generate_state() -> str:
    return secrets.token_urlsafe(32)


def _is_safe_redirect_path(path: str | None) -> bool:
    """オープンリダイレクト脆弱性を防ぐため、安全な相対パスか検証."""
    if not path:
        return False
    return path.startswith("/") and not path.startswith("//") and "\\" not in path


@router.get("/me", response_model=UserResponse)
def get_current_auth_user(
    current_user: CurrentUser,
) -> UserResponse:
    """現在のセッション（Cookie）からログイン中のユーザー情報を取得."""
    return UserResponse.model_validate(current_user)


@router.get("/google/login")
def google_login(request: Request, redirect_to: str | None = None):
    """Google OAuth2 認証フローを開始."""
    state = generate_state()
    redirect_uri = f"{settings.BACKEND_URL}/api/auth/google/callback"
    params = {
        "response_type": "code",
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    )
    response = RedirectResponse(url=google_auth_url)
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        max_age=600,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
    )
    if redirect_to and _is_safe_redirect_path(redirect_to):
        response.set_cookie(
            key="oauth_redirect",
            value=redirect_to,
            httponly=True,
            max_age=600,
            secure=settings.ENVIRONMENT == "production",
            samesite="lax",
        )
    return response


@router.get("/google/callback")
def google_callback(
    request: Request,
    code: str,
    state: str,
    user_service: UserService = Depends(_get_user_service),
):
    """Google コールバックを処理してJWTクッキーをセット."""
    stored_state = request.cookies.get("oauth_state")
    if not stored_state or stored_state != state:
        raise HTTPException(
            status_code=400, detail="Invalid state parameter - possible CSRF attack"
        )

    try:
        jwt_token = auth_service.authenticate_google_user(
            code=code, user_service=user_service
        )
    except HTTPException as e:
        if e.status_code == 403:
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/auth?error=unauthorized"
            )
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Authentication failed: {e!s}"
        ) from e

    redirect_path = request.cookies.get("oauth_redirect")
    if redirect_path:
        redirect_path = redirect_path.strip('"')
    target_url = (
        f"{settings.FRONTEND_URL}{redirect_path}"
        if redirect_path and _is_safe_redirect_path(redirect_path)
        else f"{settings.FRONTEND_URL}"
    )

    response = RedirectResponse(url=target_url)
    cookie_params = {
        "key": "access_token",
        "value": jwt_token,
        "httponly": True,
        "max_age": 60 * settings.JWT_EXPIRE_MINUTES,
        "secure": settings.ENVIRONMENT == "production",
        "samesite": "lax",
        "path": "/",
    }
    if settings.ENVIRONMENT == "development":
        cookie_params["domain"] = "localhost"
    response.set_cookie(**cookie_params)
    response.delete_cookie("oauth_state")
    response.delete_cookie("oauth_redirect")
    return response


@router.post("/logout", response_model=MessageResponse)
def logout():
    """ログアウト（セッションクッキーを削除）."""
    response = JSONResponse(content={"message": "Successfully logged out"})
    delete_params = {
        "key": "access_token",
        "httponly": True,
        "samesite": "lax",
        "path": "/",
    }
    if settings.ENVIRONMENT == "development":
        delete_params["domain"] = "localhost"
    response.delete_cookie(**delete_params)
    return response
