"""AuthService 単体テスト."""

from unittest.mock import patch

import pytest
from fastapi import HTTPException

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService
from app.services.user_service import UserService


@pytest.fixture
def auth_service():
    return AuthService()


@pytest.fixture
def user_service(db_session):
    return UserService(UserRepository(db_session))


def test_authenticate_google_user_success(auth_service, user_service):
    # 事前登録
    user_service.create_user(
        UserCreate(
            google_uid="google_uid_registered",
            email="registered@example.com",
            name="Registered User",
        )
    )

    with (
        patch.object(
            auth_service,
            "_exchange_code_for_token",
            return_value={"access_token": "dummy_token"},
        ),
        patch.object(
            auth_service,
            "_fetch_user_info",
            return_value={
                "sub": "google_uid_registered",
                "email": "registered@example.com",
                "name": "Updated Name",
                "picture": "https://example.com/avatar.png",
                "email_verified": True,
            },
        ),
    ):
        jwt_token = auth_service.authenticate_google_user("dummy_code", user_service)
        assert isinstance(jwt_token, str)
        assert len(jwt_token) > 0

    # 同期されたか確認
    user = user_service.get_by_google_uid("google_uid_registered")
    assert user.name == "Updated Name"
    assert user.avatar_url == "https://example.com/avatar.png"


def test_authenticate_google_user_not_registered(auth_service, user_service):
    # 事前登録していない UID での認証
    with (
        patch.object(
            auth_service,
            "_exchange_code_for_token",
            return_value={"access_token": "dummy_token"},
        ),
        patch.object(
            auth_service,
            "_fetch_user_info",
            return_value={
                "sub": "google_uid_unknown",
                "email": "unknown@example.com",
                "name": "Unknown User",
                "email_verified": True,
            },
        ),
    ):
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_google_user("dummy_code", user_service)
        assert exc_info.value.status_code == 403
        assert "事前登録" in exc_info.value.detail


def test_authenticate_google_user_soft_deleted(auth_service, user_service):
    # 事前登録後、論理削除されたユーザー
    user = user_service.create_user(
        UserCreate(
            google_uid="google_uid_deleted",
            email="deleted@example.com",
            name="Deleted User",
        )
    )
    user_service.delete_user(user.id)

    with (
        patch.object(
            auth_service,
            "_exchange_code_for_token",
            return_value={"access_token": "dummy_token"},
        ),
        patch.object(
            auth_service,
            "_fetch_user_info",
            return_value={
                "sub": "google_uid_deleted",
                "email": "deleted@example.com",
                "name": "Deleted User",
                "email_verified": True,
            },
        ),
    ):
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_google_user("dummy_code", user_service)
        assert exc_info.value.status_code == 403
        assert "利用が停止" in exc_info.value.detail
