# 本番デプロイガイド

ynym Portal バックエンドを本番環境へデプロイするためのガイドです。

## 前提条件

- PostgreSQL 12+ が稼働していること
- Python 3.14+ 環境
- Docker 対応サーバー（推奨）

## 環境設定

### 1. 本番用環境変数の設定

`.env.sample` を `.env` にコピーして本番の値を設定します:

```bash
cp .env.sample .env
```

`.env` の設定例:

```env
# データベース
DB_HOST=db-host
DB_PORT=5432
DB_NAME=ynym_db
DB_USER=ynym_user
DB_PASSWORD=<strong-password>

# JWT
JWT_SECRET_KEY=<strong-random-secret-key>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Google認証
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# URL設定
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://api.your-domain.com

# CORS設定 (カンマ区切りで複数指定可能)
ALLOWED_ORIGINS=https://your-frontend-domain.com

# 環境
ENVIRONMENT=production
LOG_LEVEL=INFO
```

**重要**: JWT 用の強力なシークレットキーを生成してください:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## デプロイ方法

### 方法 1: Docker（推奨）

プロジェクトルートの `Dockerfile` を使用してビルド・起動します:

```bash
docker build -t ynym-portal-backend .
docker run -p 80:80 --env-file .env ynym-portal-backend
```

`compose.yml` を使用する場合:

```bash
docker compose up -d
```

### 方法 2: サーバーへの直接デプロイ

```bash
# 依存パッケージのインストール
uv sync --no-dev

# 本番用 ASGI サーバーで起動 (gunicorn + uvicorn)
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## データベースセットアップ

```bash
# データベースの作成
createdb ynym_db

# データベースユーザーの設定
createuser ynym_user
ALTER USER ynym_user WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE ynym_db TO ynym_user;
```

## リバースプロキシ設定

### Nginx 設定例

```nginx
upstream ynym_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://ynym_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL/TLS 設定

Certbot を使用して Let's Encrypt 証明書を取得します:

```bash
sudo certbot certonly --standalone -d api.example.com
```

取得した SSL 証明書を使用するように Nginx 設定を更新してください。

## 監視

### ヘルスチェック

```bash
curl http://localhost:8000/health
```

### ロギング

本番環境向けに集中ログ管理（ELK Stack、Datadog、New Relic 等）を設定してください。

## スケーリング

- gunicorn で複数ワーカープロセスを使用: `-w 4`
- 水平スケーリングのためにロードバランサー配下にデプロイ
- データベースのコネクションプーリングを使用
- キャッシュレイヤー（Redis）の導入を検討

## セキュリティ上の考慮事項

1. **HTTPS 必須**: 本番環境では常に HTTPS を使用する
2. **CORS**: CORS を適切に設定する
3. **レート制限**: API エンドポイントにレート制限を実装する
4. **入力バリデーション**: すべてのユーザー入力を検証する（Pydantic により処理済み）
5. **依存関係**: 依存パッケージを最新に保つ
6. **シークレット管理**: `.env` ファイルをコミットせず、環境変数を使用する
7. **データベース**: 強力なパスワードを使用し、データベースユーザーの権限を最小限に制限する

## メンテナンス

### アップデート

```bash
git pull
uv sync
# アプリケーションを再起動
```

### バックアップ

定期的な PostgreSQL バックアップを設定します:

```bash
# 日次バックアップ
pg_dump ynym_db > backup_$(date +%Y%m%d).sql
```

### 監視とアラート

以下の項目について監視を設定してください:

- アプリケーションの稼働状況
- データベースのパフォーマンス
- エラー率
- レスポンスタイム
- リソース使用率
