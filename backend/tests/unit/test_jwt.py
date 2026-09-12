"""JWTユーティリティのユニットテスト."""

from datetime import UTC, datetime, timedelta

import pytest
from jose import jwt

from app.core.config import settings
from app.security.jwt import (
    TokenValidationError,
    create_access_token,
    decode_access_token,
)


class TestJWT:
    """JWT生成および検証のテスト."""

    def test_create_and_decode_access_token_success(self) -> None:
        """トークンが正常に生成され、デコードできること."""
        data = {"sub": "user@example.com", "role": "admin"}
        token = create_access_token(data)

        payload = decode_access_token(token)
        assert payload["sub"] == "user@example.com"
        assert payload["role"] == "admin"
        assert "exp" in payload

    def test_create_access_token_with_custom_expires_delta(self) -> None:
        """カスタム有効期限を指定してトークンが生成できること."""
        data = {"sub": "user@example.com"}
        delta = timedelta(minutes=15)
        now_before = datetime.now(UTC)
        token = create_access_token(data, expires_delta=delta)
        now_after = datetime.now(UTC)

        payload = decode_access_token(token)
        exp_timestamp = payload["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=UTC)

        expected_min = now_before + delta
        expected_max = now_after + delta
        assert (
            expected_min - timedelta(seconds=1)
            <= exp_datetime
            <= expected_max + timedelta(seconds=1)
        )

    def test_decode_invalid_token_raises_validation_error(self) -> None:
        """不正な形式のトークンのデコード時にTokenValidationErrorが発生すること."""
        with pytest.raises(TokenValidationError, match="Token validation failed"):
            decode_access_token("invalid.token.string")

    def test_decode_expired_token_raises_validation_error(self) -> None:
        """期限切れトークンのデコード時にTokenValidationErrorが発生すること."""
        data = {"sub": "user@example.com"}
        # 過去の時刻を有効期限としてトークンを生成
        past_delta = timedelta(minutes=-10)
        token = create_access_token(data, expires_delta=past_delta)

        with pytest.raises(TokenValidationError, match="Token validation failed"):
            decode_access_token(token)

    def test_decode_token_with_wrong_secret_raises_validation_error(self) -> None:
        """異なるシークレットで署名されたトークンのデコード時にTokenValidationErrorが発生すること."""
        data = {
            "sub": "user@example.com",
            "exp": datetime.now(UTC) + timedelta(minutes=30),
        }
        token = jwt.encode(data, "wrong-secret-key", algorithm=settings.JWT_ALGORITHM)

        with pytest.raises(TokenValidationError, match="Token validation failed"):
            decode_access_token(token)
