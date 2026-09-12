"""コネクションプール設定および接続ライフサイクルのユニットテスト."""

from unittest.mock import patch

import pytest
from sqlalchemy import NullPool, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

from app.core.config import settings
from app.core.db import create_db_engine, get_db, transactional_session


class TestDBPoolSettings:
    """コネクションプール有効判定設定のテスト."""

    def test_pool_enabled_by_default_in_production(self) -> None:
        """production 環境ではデフォルトでプールが有効になること."""
        s = settings.model_copy(
            update={"ENVIRONMENT": "production", "DB_POOL_ENABLED": None}
        )
        assert s.is_db_pool_enabled is True

    def test_pool_enabled_by_default_in_staging(self) -> None:
        """staging 環境ではデフォルトでプールが有効になること."""
        s = settings.model_copy(
            update={"ENVIRONMENT": "staging", "DB_POOL_ENABLED": None}
        )
        assert s.is_db_pool_enabled is True

    def test_pool_disabled_by_default_in_development(self) -> None:
        """development 環境ではデフォルトでプールが無効になること."""
        s = settings.model_copy(
            update={"ENVIRONMENT": "development", "DB_POOL_ENABLED": None}
        )
        assert s.is_db_pool_enabled is False

    def test_pool_override_true_in_development(self) -> None:
        """development 環境でも DB_POOL_ENABLED=True で明示的に有効化できること."""
        s = settings.model_copy(
            update={"ENVIRONMENT": "development", "DB_POOL_ENABLED": True}
        )
        assert s.is_db_pool_enabled is True

    def test_pool_override_false_in_production(self) -> None:
        """production 環境でも DB_POOL_ENABLED=False で明示的に無効化できること."""
        s = settings.model_copy(
            update={"ENVIRONMENT": "production", "DB_POOL_ENABLED": False}
        )
        assert s.is_db_pool_enabled is False


class TestCreateDBEngine:
    """create_db_engine 関数のテスト."""

    def test_create_engine_with_queue_pool(self) -> None:
        """プール有効設定時に QueuePool および指定パラメータが設定されること."""
        s = settings.model_copy(
            update={
                "ENVIRONMENT": "production",
                "DB_POOL_ENABLED": True,
                "DB_POOL_SIZE": 8,
                "DB_MAX_OVERFLOW": 15,
                "DB_POOL_TIMEOUT": 45,
                "DB_POOL_RECYCLE": 1200,
                "DB_POOL_PRE_PING": True,
            }
        )
        with patch.object(type(s), "database_url", "sqlite:///:memory:"):
            engine = create_db_engine(s)
            assert isinstance(engine.pool, QueuePool)
            assert engine.pool.size() == 8
            assert engine.pool._max_overflow == 15
            assert engine.pool._timeout == 45
            assert engine.pool._recycle == 1200
            assert engine.pool._pre_ping is True

    def test_create_engine_with_null_pool(self) -> None:
        """プール無効設定時に NullPool が設定されること."""
        s = settings.model_copy(
            update={
                "ENVIRONMENT": "development",
                "DB_POOL_ENABLED": False,
                "DB_POOL_PRE_PING": True,
            }
        )
        with patch.object(type(s), "database_url", "sqlite:///:memory:"):
            engine = create_db_engine(s)
            assert isinstance(engine.pool, NullPool)
            assert engine.pool._pre_ping is True


class TestDBPoolConnectionLifecycle:
    """QueuePool 利用時の接続解放・返却ライフサイクルの検証."""

    @pytest.fixture
    def queue_pool_engine(self):
        """テスト用の QueuePool SQLite エンジン."""
        s = settings.model_copy(
            update={
                "ENVIRONMENT": "production",
                "DB_POOL_ENABLED": True,
                "DB_POOL_SIZE": 3,
                "DB_MAX_OVERFLOW": 2,
                "DB_POOL_TIMEOUT": 10,
                "DB_POOL_RECYCLE": -1,
                "DB_POOL_PRE_PING": False,
            }
        )
        with patch.object(type(s), "database_url", "sqlite:///:memory:"):
            engine = create_db_engine(s)
            yield engine
            engine.dispose()

    def test_get_db_releases_connection_to_pool_on_success(
        self, queue_pool_engine
    ) -> None:
        """get_db が正常終了した際に、接続がプールに返却されること."""
        test_session_local = sessionmaker(bind=queue_pool_engine)
        assert queue_pool_engine.pool.checkedout() == 0

        with patch("app.core.db.session_local", test_session_local):
            gen = get_db()
            session = next(gen)
            # クエリ実行により接続をチェックアウト
            session.execute(text("SELECT 1"))
            assert queue_pool_engine.pool.checkedout() == 1

            # ジェネレータ終了（commit & close）
            try:
                next(gen)
            except StopIteration:
                pass

        # セッション close 後、プールに返却されていること
        assert queue_pool_engine.pool.checkedout() == 0

    def test_get_db_releases_connection_to_pool_on_exception(
        self, queue_pool_engine
    ) -> None:
        """get_db 内で例外が発生した際にも、接続がプールに返却されること."""
        test_session_local = sessionmaker(bind=queue_pool_engine)
        assert queue_pool_engine.pool.checkedout() == 0

        with patch("app.core.db.session_local", test_session_local):
            gen = get_db()
            session = next(gen)
            session.execute(text("SELECT 1"))
            assert queue_pool_engine.pool.checkedout() == 1

            with pytest.raises(RuntimeError):
                gen.throw(RuntimeError("意図的なエラー"))

        assert queue_pool_engine.pool.checkedout() == 0

    def test_transactional_session_releases_connection_on_success(
        self, queue_pool_engine
    ) -> None:
        """transactional_session 正常終了時に接続がプールに返却されること."""
        test_session_local = sessionmaker(bind=queue_pool_engine)
        assert queue_pool_engine.pool.checkedout() == 0

        with patch("app.core.db.session_local", test_session_local):
            with transactional_session() as session:
                session.execute(text("SELECT 1"))
                assert queue_pool_engine.pool.checkedout() == 1

        assert queue_pool_engine.pool.checkedout() == 0

    def test_transactional_session_releases_connection_on_exception(
        self, queue_pool_engine
    ) -> None:
        """transactional_session 例外発生時に接続がプールに返却されること."""
        test_session_local = sessionmaker(bind=queue_pool_engine)
        assert queue_pool_engine.pool.checkedout() == 0

        with patch("app.core.db.session_local", test_session_local):
            with pytest.raises(ValueError):
                with transactional_session() as session:
                    session.execute(text("SELECT 1"))
                    assert queue_pool_engine.pool.checkedout() == 1
                    raise ValueError("意図的なエラー")

        assert queue_pool_engine.pool.checkedout() == 0
