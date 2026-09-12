"""ゴミ箱 API エンドポイント統合テスト."""

from fastapi.testclient import TestClient


class TestTrashEndpoints:
    """/api/trash 統合テスト."""

    def test_non_admin_forbidden(self, client: TestClient) -> None:
        """一般ユーザー（管理者権限なし）はゴミ箱 API にアクセスできない（403 Forbidden）."""
        from uuid import UUID

        from app.main import app
        from app.models.user import User
        from app.security.deps import get_current_user

        non_admin = User(
            id=UUID("550e8400-e29b-41d4-a716-446655440001"),
            google_uid="non_admin_uid",
            email="nonadmin@example.com",
            name="一般ユーザー",
            avatar_url=None,
            is_admin=False,
            deleted_at=None,
        )
        app.dependency_overrides[get_current_user] = lambda: non_admin

        try:
            res = client.get("/api/trash/summary")
            assert res.status_code == 403
            assert res.json()["detail"] == "管理者権限が必要です。"
        finally:
            app.dependency_overrides.pop(get_current_user, None)

    def test_trash_summary_initial(self, client: TestClient) -> None:
        """初期状態でサマリーが全件 0."""
        res = client.get("/api/trash/summary")
        assert res.status_code == 200
        data = res.json()["data"]
        assert data["tasks"] == 0
        assert data["notes"] == 0
        assert data["note_categories"] == 0
        assert data["vehicles"] == 0
        assert data["fuel_records"] == 0
        assert data["total"] == 0

    def test_task_soft_delete_list_and_restore(self, client: TestClient) -> None:
        """タスクの論理削除、ゴミ箱一覧取得、復元のフロー."""
        # 1. 作成
        create_res = client.post("/api/tasks", json={"title": "テストタスク"})
        assert create_res.status_code == 201
        task_id = create_res.json()["data"]["id"]

        # 2. 論理削除
        del_res = client.delete(f"/api/tasks/{task_id}")
        assert del_res.status_code == 204

        # 3. 通常一覧にはない
        list_res = client.get("/api/tasks")
        assert len(list_res.json()["data"]) == 0

        # 4. サマリーでカウント確認
        summary_res = client.get("/api/trash/summary")
        assert summary_res.json()["data"]["tasks"] == 1
        assert summary_res.json()["data"]["total"] == 1

        # 5. ゴミ箱一覧に存在
        trash_list_res = client.get("/api/trash/tasks")
        assert trash_list_res.status_code == 200
        assert len(trash_list_res.json()["data"]) == 1
        assert trash_list_res.json()["data"][0]["id"] == task_id
        assert trash_list_res.json()["data"][0]["deleted_at"] is not None

        # 6. 復元
        restore_res = client.post(f"/api/trash/tasks/{task_id}/restore")
        assert restore_res.status_code == 200
        assert restore_res.json()["data"]["deleted_at"] is None

        # 7. 通常一覧に復活
        list_res2 = client.get("/api/tasks")
        assert len(list_res2.json()["data"]) == 1

        # 8. ゴミ箱からは消える
        trash_list_res2 = client.get("/api/trash/tasks")
        assert len(trash_list_res2.json()["data"]) == 0

    def test_task_purge(self, client: TestClient) -> None:
        """タスクの完全削除フロー."""
        # 1. 作成＆論理削除
        task_id = client.post("/api/tasks", json={"title": "削除用"}).json()["data"][
            "id"
        ]
        client.delete(f"/api/tasks/{task_id}")

        # 2. 完全削除
        purge_res = client.delete(f"/api/trash/tasks/{task_id}")
        assert purge_res.status_code == 204

        # 3. ゴミ箱にもなく、個別GETでも404
        trash_list_res = client.get("/api/trash/tasks")
        assert len(trash_list_res.json()["data"]) == 0
        get_res = client.get(f"/api/tasks/{task_id}")
        assert get_res.status_code == 404

    def test_note_and_category_restore_dependency(self, client: TestClient) -> None:
        """カテゴリが論理削除中の場合、ノートの復元が 409 Conflict になること."""
        # 1. カテゴリとノート作成
        cat_id = client.post("/api/note-categories", json={"name": "カテゴリ"}).json()[
            "data"
        ]["id"]
        note_id = client.post(
            "/api/notes",
            json={"title": "ノート", "body": "本文", "category_id": cat_id},
        ).json()["data"]["id"]

        # 2. ノートを論理削除、カテゴリを論理削除
        client.delete(f"/api/notes/{note_id}")
        client.delete(f"/api/note-categories/{cat_id}")

        # 3. ノートの復元を試みると 409 Conflict
        restore_fail = client.post(f"/api/trash/notes/{note_id}/restore")
        assert restore_fail.status_code == 409
        assert "所属カテゴリがゴミ箱に入っているため" in restore_fail.json()["message"]

        # 4. 先にカテゴリを復元
        cat_restore = client.post(f"/api/trash/note_categories/{cat_id}/restore")
        assert cat_restore.status_code == 200

        # 5. ノートを復元可能になる
        note_restore = client.post(f"/api/trash/notes/{note_id}/restore")
        assert note_restore.status_code == 200

    def test_vehicle_and_fuel_record_constraints(self, client: TestClient) -> None:
        """車両と燃費記録の復元および完全削除制約."""
        # 1. 車両作成
        veh_id = client.post(
            "/api/vehicles",
            json={"name": "マイカー", "maker": "トヨタ", "model": "プリウス"},
        ).json()["data"]["id"]

        # 2. 燃費記録作成
        record_id = client.post(
            "/api/fuel-records",
            json={
                "vehicle_id": veh_id,
                "refuel_datetime": "2026-09-01T10:00:00+09:00",
                "total_mileage": 10000,
                "fuel_type": "レギュラー",
                "unit_price": 170,
                "total_cost": 5000,
                "is_full_tank": True,
            },
        ).json()["data"]["id"]

        # 3. 燃費記録削除、車両削除
        client.delete(f"/api/fuel-records/{record_id}")
        client.delete(f"/api/vehicles/{veh_id}")

        # 4. 車両がゴミ箱にある状態で燃費記録の復元を試行 -> 409 Conflict
        fuel_restore_fail = client.post(f"/api/trash/fuel_records/{record_id}/restore")
        assert fuel_restore_fail.status_code == 409
        assert "親の車両がゴミ箱に入っているため" in fuel_restore_fail.json()["message"]

        # 5. 燃費記録がゴミ箱にある状態で車両の完全削除を試行 -> 409 Conflict
        veh_purge_fail = client.delete(f"/api/trash/vehicles/{veh_id}")
        assert veh_purge_fail.status_code == 409
        assert "関連する給油記録が存在するため" in veh_purge_fail.json()["message"]

        # 6. 先に燃費記録を完全削除
        fuel_purge = client.delete(f"/api/trash/fuel_records/{record_id}")
        assert fuel_purge.status_code == 204

        # 7. 車両の完全削除が可能になる
        veh_purge = client.delete(f"/api/trash/vehicles/{veh_id}")
        assert veh_purge.status_code == 204

    def test_empty_trash_endpoint(self, client: TestClient) -> None:
        """一括完全削除（empty trash）の動作確認."""
        t1 = client.post("/api/tasks", json={"title": "T1"}).json()["data"]["id"]
        t2 = client.post("/api/tasks", json={"title": "T2"}).json()["data"]["id"]
        client.delete(f"/api/tasks/{t1}")
        client.delete(f"/api/tasks/{t2}")

        empty_res = client.delete("/api/trash/tasks")
        assert empty_res.status_code == 200
        assert empty_res.json()["data"]["purged_count"] == 2

        summary_res = client.get("/api/trash/summary")
        assert summary_res.json()["data"]["tasks"] == 0
