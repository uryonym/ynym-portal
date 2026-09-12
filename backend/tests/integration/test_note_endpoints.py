"""ノート/カテゴリ API エンドポイント統合テスト."""

from fastapi.testclient import TestClient


class TestNoteEndpoints:
    """/api/notes エンドポイントのテスト."""

    def test_get_notes_list_empty(self, client: TestClient) -> None:
        """ノート一覧取得が正常に応答する."""
        response = client.get("/api/notes")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)
        assert data["message"] == "ノート一覧を取得しました"

    def test_post_notes_create_success(self, client: TestClient) -> None:
        """ノート作成が成功する."""
        payload = {
            "title": "新しいノート",
            "body": "本文",
        }
        response = client.post("/api/notes", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert data["data"]["title"] == "新しいノート"
        assert data["data"]["body"] == "本文"
        assert data["message"] == "ノートが作成されました"

    def test_delete_note_success(self, client: TestClient) -> None:
        """ノート削除で 204 を返し、論理削除されて取得できなくなる."""
        # ノート作成
        create_res = client.post(
            "/api/notes", json={"title": "削除用ノート", "body": "削除予定"}
        )
        assert create_res.status_code == 201
        note_id = create_res.json()["data"]["id"]

        # ノート削除
        del_res = client.delete(f"/api/notes/{note_id}")
        assert del_res.status_code == 204

        # 削除後に単体取得すると 404
        get_res = client.get(f"/api/notes/{note_id}")
        assert get_res.status_code == 404

        # 削除後に一覧取得しても含まれない
        list_res = client.get("/api/notes")
        assert list_res.status_code == 200
        ids = [n["id"] for n in list_res.json()["data"]]
        assert note_id not in ids


class TestNoteCategoryEndpoints:
    """/api/note-categories エンドポイントのテスト."""

    def test_get_note_categories_list_empty(self, client: TestClient) -> None:
        """カテゴリ一覧取得が正常に応答する."""
        response = client.get("/api/note-categories")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)
        assert data["message"] == "カテゴリ一覧を取得しました"

    def test_post_note_categories_create_success(self, client: TestClient) -> None:
        """カテゴリ作成が成功する."""
        payload = {
            "name": "仕事",
        }
        response = client.post("/api/note-categories", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert data["data"]["name"] == "仕事"
        assert data["message"] == "カテゴリが作成されました"

    def test_delete_note_category_success(self, client: TestClient) -> None:
        """ノートのないカテゴリを削除でき、論理削除されて取得できなくなる."""
        # カテゴリ作成
        create_res = client.post("/api/note-categories", json={"name": "削除用カテゴリ"})
        assert create_res.status_code == 201
        cat_id = create_res.json()["data"]["id"]

        # 削除
        del_res = client.delete(f"/api/note-categories/{cat_id}")
        assert del_res.status_code == 204

        # 単体取得で 404
        get_res = client.get(f"/api/note-categories/{cat_id}")
        assert get_res.status_code == 404

        # 一覧から除外
        list_res = client.get("/api/note-categories")
        assert list_res.status_code == 200
        ids = [c["id"] for c in list_res.json()["data"]]
        assert cat_id not in ids

    def test_delete_note_category_with_notes_conflict(
        self, client: TestClient
    ) -> None:
        """ノートが存在するカテゴリを削除しようとすると 409 Conflict が返る."""
        # カテゴリ作成
        cat_res = client.post("/api/note-categories", json={"name": "ノートありカテゴリ"})
        assert cat_res.status_code == 201
        cat_id = cat_res.json()["data"]["id"]

        # そのカテゴリに属するノート作成
        note_res = client.post(
            "/api/notes",
            json={"title": "カテゴリ付きノート", "body": "本文", "category_id": cat_id},
        )
        assert note_res.status_code == 201

        # カテゴリ削除試行 -> 409 Conflict
        del_res = client.delete(f"/api/note-categories/{cat_id}")
        assert del_res.status_code == 409
        data = del_res.json()
        assert "message" in data
        assert "ノートが存在するため" in data["message"]
