# アーキテクチャ

## 概要

バックエンドアプリケーションは、レイヤードクリーンアーキテクチャを採用しています:

```
┌─────────────────────────────────────┐
│        FastAPI アプリケーション      │
│            (app/main.py)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Router レイヤー (エンドポイント)  │
│          (app/routers/...)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Service レイヤー           │
│          (app/services/...)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Repository レイヤー          │
│        (app/repositories/...)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data レイヤー (SQLAlchemy)     │
│          (app/models/...)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       データベース (PostgreSQL)     │
└─────────────────────────────────────┘
```

## 主要コンポーネント

### Router レイヤー (`app/routers/`)

- HTTP リクエストとレスポンスを処理します
- Pydantic v2 スキーマ（`app/schemas/`）によるリクエストバリデーションとレスポンスシリアライズを行います
- `/api` プレフィックス配下にマウントされています

### Service レイヤー (`app/services/`)

- ビジネスロジックを保持します
- 複数エンティティにまたがる操作の調停やドメインルールの検証を行います
- 標準アプリケーション例外（`app/utils/exceptions.py`）を送出します

### Repository レイヤー (`app/repositories/`)

- データベースクエリとデータ永続化をカプセル化します
- `BaseRepository` または `UserOwnedSoftDeleteRepository` を継承します
- SQLAlchemy のクエリ構築をビジネスロジックから分離します

### Data レイヤー (`app/models/`)

- `Base`（`app/models/base.py`）を継承した SQLAlchemy 2.0 ORM モデルを定義します
- 論理削除（`deleted_at`）や JST タイムゾーンヘルパーを備えた PostgreSQL スキーマを表現します

### スキーマ (`app/schemas/`)

- リクエストバリデーションおよびレスポンス整形用の Pydantic v2 モデルです
- `app/schemas/base.py` にベーススキーマ（`EntityResponseBase`、`SoftDeleteEntityResponseBase`）を定義しています

### セキュリティ (`app/security/`)

- Google OAuth2 フローを用いた BFF パターンを実装しています
- JWT トークン管理および HttpOnly Cookie によるセッション制御を行います（`app/security/deps.py`）

### コア・データベース (`app/core/`)

- `app/core/config.py`: Pydantic Settings を用いた環境変数ベースの設定管理
- `app/core/db.py`: SQLAlchemy 2.0 と `psycopg` を用いた PostgreSQL 接続・セッション管理

### ユーティリティ (`app/utils/`)

- カスタムアプリケーション例外（`app/utils/exceptions.py`）
- FastAPI 用の共通例外ハンドラー
- ロギング設定

## データフロー

1. **リクエスト** → FastAPI が `/api/...` で HTTP リクエストを受信
2. **認証 / 依存関係** → HttpOnly Cookie セッションから現在のユーザーを検証（`CurrentUser`）
3. **バリデーション** → Pydantic スキーマが入力値を検証
4. **Router** → エンドポイントが対応する Service に処理を委譲
5. **Service** → ビジネスロジックおよびドメイン検証を実行
6. **Repository** → PostgreSQL に対して SQLAlchemy 2.0 クエリを実行
7. **レスポンス** → Pydantic レスポンスモデルでシリアライズ
8. **出力** → FastAPI が JSON レスポンスを返却
