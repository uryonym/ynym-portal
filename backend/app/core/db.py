from collections.abc import Generator
from contextlib import contextmanager
from typing import Annotated

from fastapi import Depends
from sqlalchemy import Engine, NullPool, create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import QueuePool

from app.core.config import Settings, settings


def create_db_engine(custom_settings: Settings | None = None) -> Engine:
    """環境設定に基づいてデータベースエンジンを作成.

    本番・ステージング環境（または DB_POOL_ENABLED=True）では QueuePool を使用し、
    開発環境やテスト環境等では NullPool を使用します。
    """
    target_settings = custom_settings or settings
    if target_settings.is_db_pool_enabled:
        return create_engine(
            target_settings.database_url,
            poolclass=QueuePool,
            pool_size=target_settings.DB_POOL_SIZE,
            max_overflow=target_settings.DB_MAX_OVERFLOW,
            pool_timeout=target_settings.DB_POOL_TIMEOUT,
            pool_recycle=target_settings.DB_POOL_RECYCLE,
            pool_pre_ping=target_settings.DB_POOL_PRE_PING,
        )
    return create_engine(
        target_settings.database_url,
        poolclass=NullPool,
        pool_pre_ping=target_settings.DB_POOL_PRE_PING,
    )


# エンジンを作成
engine = create_db_engine()

# セッションファクトリを作成
session_local = sessionmaker(engine)


# セッション生成（リクエスト単位のトランザクション管理）
def get_db() -> Generator[Session, None, None]:
    """FastAPI 依存関係用 DB セッション.

    正常終了時に自動 commit、例外発生時に自動 rollback を行います。
    """
    session = session_local()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@contextmanager
def transactional_session() -> Generator[Session, None, None]:
    """コンテキストマネージャ用 DB セッション.

    スクリプトやバックグラウンドタスクなど、FastAPI リクエスト外で
    自動 commit / rollback トランザクションを扱う際に使用します。
    """
    session = session_local()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


# 互換性のためのエイリアス
get_session = get_db

# 依存関係注入用の型エイリアス
SessionDep = Annotated[Session, Depends(get_db)]
