# Testing Guide

## Test Structure

Tests are organized into two categories:

- **Unit Tests** (`tests/unit/`): Test domain services, repositories, and business logic
- **Integration Tests** (`tests/integration/`): Test API endpoints and database operations using `TestClient`

Test markers (`unit` / `integration`) are automatically applied based on test file locations.

## Running Tests

### Run all tests

```bash
uv run pytest
```

### Run only unit tests

```bash
uv run pytest -m unit
```

### Run only integration tests

```bash
uv run pytest -m integration
```

### Run specific test file

```bash
uv run pytest tests/unit/test_user_service.py
```

### Run with coverage

```bash
uv run pytest --cov=app --cov-report=html
```

## Writing Tests

### Unit Test Example

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

### Integration Test Example

```python
def test_get_users(client):
    """GET /api/users エンドポイントテスト."""
    response = client.get("/api/users")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
```
