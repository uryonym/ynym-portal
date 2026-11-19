# 開発環境セットアップ

## 前提条件

- Python 3.14+
- uv パッケージマネージャー
- PostgreSQL 12+

## インストール

### 1. 依存パッケージのインストール

```bash
uv sync
```

### 2. 環境変数の設定

`.env.sample` を `.env` にコピーし、環境に合わせて値を更新します:

```bash
cp .env.sample .env
```

### 3. データベースの初期化

```bash
# データベースの作成
createdb ynym_db

# マイグレーションの実行（今後 Alembic を導入する場合）
```

## アプリケーションの起動

### 開発サーバー

```bash
uvicorn app.main:app --reload
```

API は `http://localhost:8000` で利用可能になります。

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## テストの実行

```bash
pytest
```

カバレッジ付きで実行する場合:

```bash
pytest --cov=app
```

## コード品質

### リント

```bash
ruff check app
```

### フォーマット

```bash
ruff format app
```

### 型チェック

```bash
mypy app
```

## ドキュメント

ドキュメントを生成してローカルサーバーでプレビューします:

```bash
mkdocs serve
```

ドキュメントは `http://localhost:8000` で閲覧できます。
