"""車両 API エンドポイント統合テスト."""

from fastapi.testclient import TestClient

NON_EXISTENT_UUID = "550e8400-e29b-41d4-a716-446655440099"


class TestVehicleEndpoints:
    """/api/vehicles エンドポイントのテスト."""

    def test_get_vehicles_list_empty(self, client: TestClient) -> None:
        """車両一覧取得が正常に応答する."""
        response = client.get("/api/vehicles")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)
        assert data["message"] == "車一覧を取得しました"

    def test_post_vehicle_create_success(self, client: TestClient) -> None:
        """車両作成が成功する."""
        payload = {
            "name": "マイカー",
            "maker": "トヨタ",
            "model": "プリウス",
            "year": 2022,
            "number": "品川 500 あ 12-34",
            "tank_capacity": 43.0,
        }
        response = client.post("/api/vehicles", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        vehicle = data["data"]
        assert vehicle["name"] == "マイカー"
        assert vehicle["maker"] == "トヨタ"
        assert vehicle["model"] == "プリウス"
        assert vehicle["year"] == 2022
        assert vehicle["number"] == "品川 500 あ 12-34"
        assert vehicle["tank_capacity"] == 43.0
        assert vehicle["seq"] == 1
        assert "id" in vehicle
        assert data["message"] == "車が作成されました"

    def test_get_vehicle_by_id_success(self, client: TestClient) -> None:
        """車両 ID で特定の車両を取得できる."""
        create_res = client.post(
            "/api/vehicles",
            json={"name": "取得対象車", "maker": "ホンダ", "model": "フィット"},
        )
        assert create_res.status_code == 201
        vehicle_id = create_res.json()["data"]["id"]

        get_res = client.get(f"/api/vehicles/{vehicle_id}")
        assert get_res.status_code == 200
        data = get_res.json()["data"]
        assert data["id"] == vehicle_id
        assert data["name"] == "取得対象車"
        assert data["maker"] == "ホンダ"

    def test_get_vehicle_by_id_not_found(self, client: TestClient) -> None:
        """存在しない車両 ID で 404 を返す."""
        response = client.get(f"/api/vehicles/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "車が見つかりません"

    def test_put_vehicle_success(self, client: TestClient) -> None:
        """車両の更新が成功する."""
        create_res = client.post(
            "/api/vehicles",
            json={"name": "更新前車", "maker": "日産", "model": "ノート"},
        )
        assert create_res.status_code == 201
        vehicle_id = create_res.json()["data"]["id"]

        update_res = client.put(
            f"/api/vehicles/{vehicle_id}",
            json={"name": "更新後車", "model": "オーラ"},
        )
        assert update_res.status_code == 200
        data = update_res.json()["data"]
        assert data["name"] == "更新後車"
        assert data["model"] == "オーラ"
        assert data["maker"] == "日産"

    def test_put_vehicle_not_found(self, client: TestClient) -> None:
        """存在しない車両 ID の更新で 404 を返す."""
        response = client.put(
            f"/api/vehicles/{NON_EXISTENT_UUID}",
            json={"name": "更新車"},
        )
        assert response.status_code == 404
        assert response.json()["message"] == "車が見つかりません"

    def test_delete_vehicle_success(self, client: TestClient) -> None:
        """車両削除で 204 を返し、論理削除されて取得できなくなる."""
        create_res = client.post(
            "/api/vehicles",
            json={"name": "削除用車", "maker": "マツダ", "model": "ロードスター"},
        )
        assert create_res.status_code == 201
        vehicle_id = create_res.json()["data"]["id"]

        del_res = client.delete(f"/api/vehicles/{vehicle_id}")
        assert del_res.status_code == 204

        get_res = client.get(f"/api/vehicles/{vehicle_id}")
        assert get_res.status_code == 404

        list_res = client.get("/api/vehicles")
        assert list_res.status_code == 200
        ids = [v["id"] for v in list_res.json()["data"]]
        assert vehicle_id not in ids

    def test_delete_vehicle_not_found(self, client: TestClient) -> None:
        """存在しない車両 ID の削除で 404 を返す."""
        response = client.delete(f"/api/vehicles/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "車が見つかりません"

    def test_post_vehicle_missing_name_fails(self, client: TestClient) -> None:
        """name を省略すると 400 エラーを返す."""
        response = client.post(
            "/api/vehicles", json={"maker": "トヨタ", "model": "ヤリス"}
        )
        assert response.status_code == 400

    def test_post_vehicle_missing_maker_fails(self, client: TestClient) -> None:
        """maker を省略すると 400 エラーを返す."""
        response = client.post("/api/vehicles", json={"name": "車", "model": "ヤリス"})
        assert response.status_code == 400

    def test_post_vehicle_missing_model_fails(self, client: TestClient) -> None:
        """model を省略すると 400 エラーを返す."""
        response = client.post("/api/vehicles", json={"name": "車", "maker": "トヨタ"})
        assert response.status_code == 400

    def test_post_vehicle_empty_name_fails(self, client: TestClient) -> None:
        """name が空文字列の場合 400 エラーを返す."""
        response = client.post(
            "/api/vehicles", json={"name": "", "maker": "トヨタ", "model": "ヤリス"}
        )
        assert response.status_code == 400

    def test_post_vehicle_name_too_long_fails(self, client: TestClient) -> None:
        """name が 255 文字を超える場合 400 エラーを返す."""
        response = client.post(
            "/api/vehicles",
            json={"name": "a" * 256, "maker": "トヨタ", "model": "ヤリス"},
        )
        assert response.status_code == 400

    def test_post_vehicle_tank_capacity_invalid_fails(self, client: TestClient) -> None:
        """tank_capacity が 0 以下の数値の場合 400 エラーを返す."""
        response = client.post(
            "/api/vehicles",
            json={
                "name": "車",
                "maker": "トヨタ",
                "model": "ヤリス",
                "tank_capacity": -5.0,
            },
        )
        assert response.status_code == 400

    def test_put_vehicle_empty_name_fails(self, client: TestClient) -> None:
        """PUT で name を空文字に更新しようとすると 400 エラーを返す."""
        create_res = client.post(
            "/api/vehicles",
            json={"name": "初期車", "maker": "トヨタ", "model": "ヤリス"},
        )
        vehicle_id = create_res.json()["data"]["id"]

        update_res = client.put(f"/api/vehicles/{vehicle_id}", json={"name": ""})
        assert update_res.status_code == 400
