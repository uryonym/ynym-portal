# ynym-portal

`ynym-portal` は、バックエンド (FastAPI) とフロントエンド (Next.js) を統合したモノレポ構成の Web アプリケーションポータルです。

## プロジェクト構成

```text
.
├── backend/               # FastAPI バックエンドシステム (Python / uv)
│   ├── app/               # アプリケーションコード (API, Models, Services, etc.)
│   ├── migrations/        # データベースマイグレーション SQL
│   ├── tests/             # pytest ユニット/統合テスト
│   ├── pyproject.toml     # Python 依存関係および設定
│   └── Dockerfile         # バックエンドコンテナ定義
├── frontend/              # Next.js フロントエンド (TypeScript / React 19 / npm)
│   ├── app/               # App Router ページ・レイアウト
│   ├── components/        # UI コンポーネント (shadcn/ui, Radix UI)
│   ├── hooks/             # カスタムフック
│   ├── lib/               # ユーティリティ・API クライアント
│   └── Dockerfile         # フロントエンドコンテナ定義
├── .github/               # GitHub 設定および指示ファイル (コミット規約等)
├── .vscode/               # VS Code / Cursor 共通設定 (デバッグ, フォーマッタ, MCP)
├── .tool-versions         # asdf バージョン管理定義 (Node.js, Python)
├── compose.yml            # Docker Compose 全体構成定義
└── Makefile               # 一括タスクランナー
```

## 前提条件

- **ランタイムバージョン管理**: [asdf](https://asdf-vm.com/)
  - Node.js `24.19.0`
  - Python `3.12.14`
- **Python パッケージマネージャー**: [uv](https://github.com/astral-sh/uv)
- **コンテナ環境** (コンテナ利用時): Docker & Docker Compose

## セットアップ手順

### 1. ランタイムのインストール (asdf)

ルートディレクトリで asdf により指定バージョンの言語ランタイムをインストールします。

```bash
# プラグインの追加 (未導入の場合)
asdf plugin add python
asdf plugin add nodejs

# .tool-versions に基づいてインストール
asdf install
```

### 2. 環境変数の設定

バックエンドおよびフロントエンドの環境変数を設定します。

```bash
# バックエンド (.env.sample をコピーして必要な値を設定)
cp backend/.env.sample backend/.env

# フロントエンド (.env.local を作成/確認)
# 例: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. 依存パッケージのインストール

`Makefile` を使用して両方の依存関係を一括インストールします。

```bash
make install
```
*(内部で `cd backend && uv sync --all-groups` および `cd frontend && npm install` が実行されます)*

## 開発サーバーの起動

### バックエンド・フロントエンドの同時起動

```bash
make dev
```
- **フロントエンド**: [http://localhost:3000](http://localhost:3000)
- **バックエンド API**: [http://localhost:8000](http://localhost:8000)
- **対話型 API ドキュメント (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 個別起動

```bash
make dev-backend   # FastAPI のみ起動 (port 8000)
make dev-frontend  # Next.js のみ起動 (port 3000)
```

## テスト・コード品質

| コマンド | 説明 |
| :--- | :--- |
| `make test` | 全テストを実行 (backend: `pytest`, frontend: `build / 型チェック`) |
| `make test-backend` | バックエンドのテストのみ実行 |
| `make test-frontend` | フロントエンドのビルド・型チェックのみ実行 |
| `make lint` | 全コードのリントを実行 (backend: `ruff check`, frontend: `eslint`) |
| `make format` | 全コードの自動整形を実行 (backend: `ruff format`, frontend: `prettier`) |

## Docker での起動

Docker Compose 用の環境変数ファイル（`.env`）を準備してから起動します。

```bash
cp .env.example .env
# 必要に応じて .env の値を編集

docker compose build
docker compose up -d
```

> **注意**: `NEXT_PUBLIC_*` 環境変数は Next.js の仕様上 Docker イメージのビルド時に JS に埋め込まれます。URL 等の環境変数を変更した場合は `docker compose build --no-cache ynym-portal-frontend` を実行して再ビルドしてください。

## コミットメッセージ規約

コミットメッセージは [`.github/copilot-instructions.md`](.github/copilot-instructions.md) に従って記述してください。
- 形式: `タグ: コミットメッセージ` (例: `feature: ...`, `fix: ...`, `refactor: ...`, `docs: ...`)
- 必ず**日本語**で記述し、50文字以内で簡潔にまとめます。
