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
