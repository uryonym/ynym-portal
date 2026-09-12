from collections.abc import Generator
from contextlib import contextmanager
from typing import Annotated

from fastapi import Depends
from sqlalchemy import NullPool, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# エンジンを作成（コネクションプール無効）
engine = create_engine(settings.database_url, poolclass=NullPool)

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
