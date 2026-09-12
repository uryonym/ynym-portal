"""ノート/カテゴリ API エンドポイント統合テスト."""

from fastapi.testclient import TestClient

NON_EXISTENT_UUID = "550e8400-e29b-41d4-a716-446655440099"


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

    def test_get_note_by_id_success(self, client: TestClient) -> None:
        """ノート ID で特定のノートを取得できる."""
        create_res = client.post(
            "/api/notes", json={"title": "取得対象ノート", "body": "本文"}
        )
        assert create_res.status_code == 201
        note_id = create_res.json()["data"]["id"]

        get_res = client.get(f"/api/notes/{note_id}")
        assert get_res.status_code == 200
        assert get_res.json()["data"]["id"] == note_id
        assert get_res.json()["data"]["title"] == "取得対象ノート"

    def test_get_note_by_id_not_found(self, client: TestClient) -> None:
        """存在しないノート ID で 404 を返す."""
        response = client.get(f"/api/notes/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "ノートが見つかりません"

    def test_put_note_success(self, client: TestClient) -> None:
        """ノートの更新が成功する."""
        create_res = client.post(
            "/api/notes", json={"title": "更新前ノート", "body": "更新前本文"}
        )
        assert create_res.status_code == 201
        note_id = create_res.json()["data"]["id"]

        update_res = client.put(
            f"/api/notes/{note_id}",
            json={"title": "更新後ノート", "body": "更新後本文"},
        )
        assert update_res.status_code == 200
        data = update_res.json()["data"]
        assert data["title"] == "更新後ノート"
        assert data["body"] == "更新後本文"

    def test_put_note_not_found(self, client: TestClient) -> None:
        """存在しないノート ID の更新で 404 を返す."""
        response = client.put(
            f"/api/notes/{NON_EXISTENT_UUID}",
            json={"title": "更新ノート"},
        )
        assert response.status_code == 404
        assert response.json()["message"] == "ノートが見つかりません"

    def test_delete_note_success(self, client: TestClient) -> None:
        """ノート削除で 204 を返し、論理削除されて取得できなくなる."""
        create_res = client.post(
            "/api/notes", json={"title": "削除用ノート", "body": "削除予定"}
        )
        assert create_res.status_code == 201
        note_id = create_res.json()["data"]["id"]

        del_res = client.delete(f"/api/notes/{note_id}")
        assert del_res.status_code == 204

        get_res = client.get(f"/api/notes/{note_id}")
        assert get_res.status_code == 404

        list_res = client.get("/api/notes")
        assert list_res.status_code == 200
        ids = [n["id"] for n in list_res.json()["data"]]
        assert note_id not in ids

    def test_delete_note_not_found(self, client: TestClient) -> None:
        """存在しないノート ID の削除で 404 を返す."""
        response = client.delete(f"/api/notes/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "ノートが見つかりません"

    def test_post_notes_missing_title_fails(self, client: TestClient) -> None:
        """title を省略すると 400 エラーを返す."""
        response = client.post("/api/notes", json={"body": "本文のみ"})
        assert response.status_code == 400

    def test_post_notes_empty_title_fails(self, client: TestClient) -> None:
        """title が空文字列の場合 400 エラーを返す."""
        response = client.post("/api/notes", json={"title": "", "body": "本文"})
        assert response.status_code == 400

    def test_post_notes_title_too_long_fails(self, client: TestClient) -> None:
        """title が 255 文字を超える場合 400 エラーを返す."""
        response = client.post("/api/notes", json={"title": "a" * 256, "body": "本文"})
        assert response.status_code == 400

    def test_post_notes_missing_body_fails(self, client: TestClient) -> None:
        """body を省略すると 400 エラーを返す."""
        response = client.post("/api/notes", json={"title": "タイトルのみ"})
        assert response.status_code == 400

    def test_post_notes_empty_body_fails(self, client: TestClient) -> None:
        """body が空文字列の場合 400 エラーを返す."""
        response = client.post("/api/notes", json={"title": "タイトル", "body": ""})
        assert response.status_code == 400

    def test_post_notes_nonexistent_category_fails(self, client: TestClient) -> None:
        """存在しない category_id を指定したノート作成で 404 エラーを返す."""
        response = client.post(
            "/api/notes",
            json={
                "title": "ノート",
                "body": "本文",
                "category_id": NON_EXISTENT_UUID,
            },
        )
        assert response.status_code == 404
        assert response.json()["message"] == "カテゴリが見つかりません"

    def test_put_notes_empty_title_fails(self, client: TestClient) -> None:
        """PUT で title を空文字に更新しようとすると 400 エラーを返す."""
        create_res = client.post(
            "/api/notes", json={"title": "初期タイトル", "body": "本文"}
        )
        note_id = create_res.json()["data"]["id"]

        update_res = client.put(f"/api/notes/{note_id}", json={"title": ""})
        assert update_res.status_code == 400


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

    def test_get_category_by_id_success(self, client: TestClient) -> None:
        """カテゴリ ID で特定のカテゴリを取得できる."""
        create_res = client.post(
            "/api/note-categories", json={"name": "取得対象カテゴリ"}
        )
        assert create_res.status_code == 201
        cat_id = create_res.json()["data"]["id"]

        get_res = client.get(f"/api/note-categories/{cat_id}")
        assert get_res.status_code == 200
        assert get_res.json()["data"]["id"] == cat_id
        assert get_res.json()["data"]["name"] == "取得対象カテゴリ"

    def test_get_category_by_id_not_found(self, client: TestClient) -> None:
        """存在しないカテゴリ ID で 404 を返す."""
        response = client.get(f"/api/note-categories/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "カテゴリが見つかりません"

    def test_put_category_success(self, client: TestClient) -> None:
        """カテゴリの更新が成功する."""
        create_res = client.post(
            "/api/note-categories", json={"name": "更新前カテゴリ"}
        )
        assert create_res.status_code == 201
        cat_id = create_res.json()["data"]["id"]

        update_res = client.put(
            f"/api/note-categories/{cat_id}", json={"name": "更新後カテゴリ"}
        )
        assert update_res.status_code == 200
        assert update_res.json()["data"]["name"] == "更新後カテゴリ"

    def test_put_category_not_found(self, client: TestClient) -> None:
        """存在しないカテゴリ ID の更新で 404 を返す."""
        response = client.put(
            f"/api/note-categories/{NON_EXISTENT_UUID}",
            json={"name": "更新カテゴリ"},
        )
        assert response.status_code == 404
        assert response.json()["message"] == "カテゴリが見つかりません"

    def test_delete_note_category_success(self, client: TestClient) -> None:
        """ノートのないカテゴリを削除でき、論理削除されて取得できなくなる."""
        create_res = client.post(
            "/api/note-categories", json={"name": "削除用カテゴリ"}
        )
        assert create_res.status_code == 201
        cat_id = create_res.json()["data"]["id"]

        del_res = client.delete(f"/api/note-categories/{cat_id}")
        assert del_res.status_code == 204

        get_res = client.get(f"/api/note-categories/{cat_id}")
        assert get_res.status_code == 404

        list_res = client.get("/api/note-categories")
        assert list_res.status_code == 200
        ids = [c["id"] for c in list_res.json()["data"]]
        assert cat_id not in ids

    def test_delete_category_not_found(self, client: TestClient) -> None:
        """存在しないカテゴリ ID の削除で 404 を返す."""
        response = client.delete(f"/api/note-categories/{NON_EXISTENT_UUID}")
        assert response.status_code == 404
        assert response.json()["message"] == "カテゴリが見つかりません"

    def test_delete_note_category_with_notes_conflict(self, client: TestClient) -> None:
        """ノートが存在するカテゴリを削除しようとすると 409 Conflict が返る."""
        cat_res = client.post(
            "/api/note-categories", json={"name": "ノートありカテゴリ"}
        )
        assert cat_res.status_code == 201
        cat_id = cat_res.json()["data"]["id"]

        note_res = client.post(
            "/api/notes",
            json={"title": "カテゴリ付きノート", "body": "本文", "category_id": cat_id},
        )
        assert note_res.status_code == 201

        del_res = client.delete(f"/api/note-categories/{cat_id}")
        assert del_res.status_code == 409
        data = del_res.json()
        assert "message" in data
        assert "ノートが存在するため" in data["message"]

    def test_post_category_missing_name_fails(self, client: TestClient) -> None:
        """name を省略すると 400 エラーを返す."""
        response = client.post("/api/note-categories", json={})
        assert response.status_code == 400

    def test_post_category_empty_name_fails(self, client: TestClient) -> None:
        """name が空文字列の場合 400 エラーを返す."""
        response = client.post("/api/note-categories", json={"name": ""})
        assert response.status_code == 400

    def test_post_category_name_too_long_fails(self, client: TestClient) -> None:
        """name が 255 文字を超える場合 400 エラーを返す."""
        response = client.post("/api/note-categories", json={"name": "a" * 256})
        assert response.status_code == 400

    def test_put_category_empty_name_fails(self, client: TestClient) -> None:
        """PUT で name を空文字に更新しようとすると 400 エラーを返す."""
        create_res = client.post("/api/note-categories", json={"name": "初期カテゴリ"})
        cat_id = create_res.json()["data"]["id"]

        update_res = client.put(f"/api/note-categories/{cat_id}", json={"name": ""})
        assert update_res.status_code == 400
