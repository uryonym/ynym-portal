# テストガイド

## テスト構成

テストは以下の 2 つのカテゴリに分かれています:

- **ユニットテスト** (`tests/unit/`): ドメインサービス、リポジトリ、ビジネスロジックをテストします
- **統合テスト** (`tests/integration/`): `TestClient` を用いて API エンドポイントとデータベース操作をテストします

テストマーカー（`unit` / `integration`）は、テストファイルの配置場所に基づいて自動的に付与されます。

## テストの実行

### すべてのテストを実行

```bash
uv run pytest
```

### ユニットテストのみ実行

```bash
uv run pytest -m unit
```

### 統合テストのみ実行

```bash
uv run pytest -m integration
```

### 特定のテストファイルを実行

```bash
uv run pytest tests/unit/test_user_service.py
```

### カバレッジ付きで実行

```bash
uv run pytest --cov=app --cov-report=html
```

## テストの書き方

### ユニットテストの例

```python
import pytest
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.services.user_service import UserService


def test_create_user(db_session):
    """ユーザー作成テスト."""
    service = UserService(UserRepository(db_session))
    user = service.create_user(
        UserCreate(
            google_uid="uid_123",
            email="test@example.com",
            name="Test User",
        )
    )
    assert user.name == "Test User"
    assert user.email == "test@example.com"
```

### 統合テストの例

```python
def test_get_users(client):
    """GET /api/users エンドポイントテスト."""
    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
```
