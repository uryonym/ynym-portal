"""ヘルスチェックエンドポイントの統合テスト."""


def test_health_check(client):
    """GET /api/health で 200 OK と DB 接続ステータスが返ること."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
