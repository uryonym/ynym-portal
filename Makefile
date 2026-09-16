.PHONY: help dev dev-backend dev-frontend test test-backend test-frontend lint lint-backend lint-frontend format format-backend format-frontend format-check format-check-backend format-check-frontend install codegen codegen-backend codegen-frontend check-codegen

.DEFAULT_GOAL := help

help: ## コマンド一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## バックエンドとフロントエンドの依存パッケージをインストール
	cd backend && uv sync --all-groups
	cd frontend && npm install

dev: ## バックエンドとフロントエンドの開発サーバーを同時起動
	@echo "Starting backend (port 8000) and frontend (port 3000)..."
	@make -j 2 dev-backend dev-frontend

dev-backend: ## バックエンド (FastAPI) 開発サーバー起動
	cd backend && uv run uvicorn app.main:app --reload

dev-frontend: ## フロントエンド (Vite) 開発サーバー起動
	cd frontend && npm run dev

test: test-backend test-frontend ## すべてのテストを実行

test-backend: ## バックエンドの pytest を実行
	cd backend && uv run pytest

test-frontend: ## フロントエンドのビルド・型チェックを実行
	cd frontend && npm run build

lint: lint-backend lint-frontend ## すべてのリントを実行

lint-backend: ## バックエンドの ruff check を実行
	cd backend && uv run ruff check

lint-frontend: ## フロントエンドの eslint を実行
	cd frontend && npm run lint

format: format-backend format-frontend ## コード自動整形を実行

format-backend: ## バックエンドのコード整形 (ruff format)
	cd backend && uv run ruff format

format-frontend: ## フロントエンドのコード整形 (prettier)
	cd frontend && npm run format

format-check: format-check-backend format-check-frontend ## コード整形のチェックを実行 (CI用)

format-check-backend: ## バックエンドのコード整形チェック (ruff format --check)
	cd backend && uv run ruff format --check

format-check-frontend: ## フロントエンドのコード整形チェック (prettier --check)
	cd frontend && npm run format:check

codegen: codegen-backend codegen-frontend ## スキーマ出力から TypeScript 型生成まで一括実行

codegen-backend: ## バックエンドの OpenAPI スキーマを JSON 出力
	cd backend && uv run python scripts/export_openapi.py

codegen-frontend: ## openapi-typescript によるフロントエンド型定義生成
	cd frontend && npm run codegen

check-codegen: codegen ## 型定義が最新化されているか検証 (CI用)
	git diff --exit-code backend/openapi.json frontend/src/lib/types/generated/
