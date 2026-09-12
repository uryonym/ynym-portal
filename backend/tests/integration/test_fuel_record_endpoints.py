"""燃費記録 API エンドポイント統合テスト."""

from fastapi.testclient import TestClient

NON_EXISTENT_UUID = "550e8400-e29b-41d4-a716-446655440099"


def _create_test_vehicle(client: TestClient) -> str:
    """テスト用の車両を作成し、その ID を返す."""
    res = client.post(
        "/api/vehicles",
        json={"name": "燃費テスト車", "maker": "トヨタ", "model": "カローラ"},
    )
    assert res.status_code == 201
    return res.json()["data"]["id"]


class TestFuelRecordEndpoints:
    """/api/fuel-records エンドポイントのテスト."""

    def test_get_fuel_records_list_empty(self, client: TestClient) -> None:
        """燃費記録一覧取得が正常に応答する."""
        vehicle_id = _create_test_vehicle(client)
        response = client.get(f"/api/fuel-records?vehicle_id={vehicle_id}")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)
        assert data["message"] == "燃費記録一覧を取得しました"

    def test_post_fuel_record_create_success(self, client: TestClient) -> None:
        """燃費記録作成が成功する."""
        vehicle_id = _create_test_vehicle(client)
        payload = {
            "vehicle_id": vehicle_id,
            "refuel_datetime": "2025-06-01T10:00:00+09:00",
            "total_mileage": 10500,
            "fuel_type": "レギュラー",
            "unit_price": 165,
            "total_cost": 6600,
            "is_full_tank": True,
            "gas_station_name": "ENEOS",
        }
        response = client.post("/api/fuel-records", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        record = data["data"]
        assert record["vehicle_id"] == vehicle_id
        assert record["total_mileage"] == 10500
        assert record["fuel_type"] == "レギュラー"
        assert record["unit_price"] == 165
        assert record["total_cost"] == 6600
        assert record["is_full_tank"] is True
        assert record["gas_station_name"] == "ENEOS"
        assert "id" in record

    def test_get_fuel_record_by_id_success(self, client: TestClient) -> None:
        """燃費記録 ID で特定の燃費記録を取得できる."""
        vehicle_id = _create_test_vehicle(client)
        create_res = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10500,
                "fuel_type": "レギュラー",
                "unit_price": 165,
                "total_cost": 6600,
            },
        )
        assert create_res.status_code == 201
        record_id = create_res.json()["data"]["id"]

        get_res = client.get(f"/api/fuel-records/{record_id}")
        assert get_res.status_code == 200
        data = get_res.json()["data"]
        assert data["id"] == record_id
        assert data["total_mileage"] == 10500

    def test_get_fuel_record_by_id_not_found(self, client: TestClient) -> None:
        """存在しない燃費記録 ID で 404 を返す."""
        response = client.get(f"/api/fuel-records/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "燃費記録が見つかりません"

    def test_put_fuel_record_success(self, client: TestClient) -> None:
        """燃費記録の更新が成功する."""
        vehicle_id = _create_test_vehicle(client)
        create_res = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10500,
                "fuel_type": "レギュラー",
                "unit_price": 165,
                "total_cost": 6600,
            },
        )
        assert create_res.status_code == 201
        record_id = create_res.json()["data"]["id"]

        update_res = client.put(
            f"/api/fuel-records/{record_id}",
            json={"total_mileage": 10550, "total_cost": 7000},
        )
        assert update_res.status_code == 200
        data = update_res.json()["data"]
        assert data["total_mileage"] == 10550
        assert data["total_cost"] == 7000

    def test_put_fuel_record_not_found(self, client: TestClient) -> None:
        """存在しない燃費記録 ID の更新で 404 を返す."""
        response = client.put(
            f"/api/fuel-records/{NON_EXISTENT_UUID}",
            json={"total_cost": 7000},
        )
        assert response.status_code == 404
        assert response.json()["message"] == "燃費記録が見つかりません"

    def test_delete_fuel_record_success(self, client: TestClient) -> None:
        """燃費記録削除で 204 を返し、論理削除されて取得できなくなる."""
        vehicle_id = _create_test_vehicle(client)
        create_res = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10500,
                "fuel_type": "レギュラー",
                "unit_price": 165,
                "total_cost": 6600,
            },
        )
        assert create_res.status_code == 201
        record_id = create_res.json()["data"]["id"]

        del_res = client.delete(f"/api/fuel-records/{record_id}")
        assert del_res.status_code == 204

        get_res = client.get(f"/api/fuel-records/{record_id}")
        assert get_res.status_code == 404

        list_res = client.get(f"/api/fuel-records?vehicle_id={vehicle_id}")
        assert list_res.status_code == 200
        ids = [r["id"] for r in list_res.json()["data"]]
        assert record_id not in ids

    def test_delete_fuel_record_not_found(self, client: TestClient) -> None:
        """存在しない燃費記録 ID の削除で 404 を返す."""
        response = client.delete(f"/api/fuel-records/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "燃費記録が見つかりません"

    def test_post_fuel_record_missing_required_fields_fails(
        self, client: TestClient
    ) -> None:
        """必須フィールドが欠落している場合 400 エラーを返す."""
        response = client.post(
            "/api/fuel-records",
            json={"total_mileage": 1000},
        )
        assert response.status_code == 400

    def test_post_fuel_record_invalid_mileage_fails(self, client: TestClient) -> None:
        """total_mileage が 0 以下の場合 400 エラーを返す."""
        vehicle_id = _create_test_vehicle(client)
        response = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 0,
                "fuel_type": "レギュラー",
                "unit_price": 165,
                "total_cost": 6600,
            },
        )
        assert response.status_code == 400

    def test_post_fuel_record_invalid_unit_price_fails(
        self, client: TestClient
    ) -> None:
        """unit_price が 0 以下の場合 400 エラーを返す."""
        vehicle_id = _create_test_vehicle(client)
        response = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10000,
                "fuel_type": "レギュラー",
                "unit_price": -1,
                "total_cost": 6600,
            },
        )
        assert response.status_code == 400

    def test_post_fuel_record_invalid_total_cost_fails(
        self, client: TestClient
    ) -> None:
        """total_cost が負の値の場合 400 エラーを返す."""
        vehicle_id = _create_test_vehicle(client)
        response = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10000,
                "fuel_type": "レギュラー",
                "unit_price": 165,
                "total_cost": -100,
            },
        )
        assert response.status_code == 400

    def test_post_fuel_record_empty_fuel_type_fails(self, client: TestClient) -> None:
        """fuel_type が空文字列の場合 400 エラーを返す."""
        vehicle_id = _create_test_vehicle(client)
        response = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10000,
                "fuel_type": "",
                "unit_price": 165,
                "total_cost": 6600,
            },
        )
        assert response.status_code == 400

    def test_put_fuel_record_invalid_mileage_fails(self, client: TestClient) -> None:
        """PUT で total_mileage を 0 以下に更新しようとすると 400 エラーを返す."""
        vehicle_id = _create_test_vehicle(client)
        create_res = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": vehicle_id,
                "refuel_datetime": "2025-06-01T10:00:00+09:00",
                "total_mileage": 10000,
                "fuel_type": "レギュラー",
                "unit_price": 165,
                "total_cost": 6600,
            },
        )
        record_id = create_res.json()["data"]["id"]

        update_res = client.put(
            f"/api/fuel-records/{record_id}",
            json={"total_mileage": 0},
        )
        assert update_res.status_code == 400
