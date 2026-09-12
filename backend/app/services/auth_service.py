"""認証サービス."""

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.security.jwt import create_access_token
from app.services.user_service import UserService


class AuthService:
    """Google OAuth2 認証フローを担うサービス."""

    GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

    def authenticate_google_user(self, code: str, user_service: UserService) -> str:
        """Google OAuth コードを検証してJWTトークンを返す."""
        token_data = self._exchange_code_for_token(code)
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve access token from Google",
            )

        user_info = self._fetch_user_info(access_token)
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google did not return an email address.",
            )
        if not user_info.get("email_verified", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google account email is not verified.",
            )

        google_uid = user_info.get("sub")
        if not google_uid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google did not return a user identifier (sub).",
            )

        # 事前登録されているか確認
        user = user_service.get_by_google_uid(google_uid, include_deleted=True)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="このアカウントは事前登録されていません。管理者に問い合わせてください。",
            )

        if user.deleted_at is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="このアカウントは利用が停止（退会）されています。",
            )

        # Googleの最新情報を反映
        user = user_service.sync_google_user(
            user=user,
            name=name or user.name,
            email=email,
            avatar_url=picture,
        )
        return create_access_token(data={"sub": user.email})

    def _exchange_code_for_token(self, code: str) -> dict:
        """OAuth コードをアクセストークンと交換."""
        redirect_uri = f"{settings.BACKEND_URL}/api/auth/google/callback"
        with httpx.Client() as client:
            response = client.post(
                self.GOOGLE_TOKEN_URL,
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                },
                headers={"Accept": "application/json"},
            )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Google token exchange failed: {response.text}",
            )
        return response.json()

    def _fetch_user_info(self, access_token: str) -> dict:
        """Google からユーザー情報を取得."""
        with httpx.Client() as client:
            response = client.get(
                self.GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch user info from Google.",
            )
        return response.json()


auth_service = AuthService()
