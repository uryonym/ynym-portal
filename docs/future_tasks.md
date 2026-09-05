# 将来の改善・検討タスク一覧

本ドキュメントは、モノレポ化完了後に今後実施を検討しているタスクのバックログです。  
将来的には GitHub Issues 等への起票を想定しています。

---

## Task 1: FastAPI OpenAPI スキーマからの TypeScript 型自動生成環境の導入

### 背景・課題
現在、バックエンド（FastAPI / Pydantic）のスキーマ定義（`backend/app/schemas/`）と、フロントエンド（Next.js / TypeScript）の型定義（`frontend/lib/types/`）はそれぞれ手動で管理されています。  
手動管理では、API のレスポンスフィールド変更や型変更が生じた際にフロントエンド側で同期漏れが発生し、実行時エラーにつながるリスクがあります。

### 目的
FastAPI が自動生成する `openapi.json` を活用し、フロントエンド側の TypeScript 型定義を自動生成・同期できる仕組みを導入する。

### 実装方針の候補
1. **`openapi-typescript` の導入**:
   - `npx openapi-typescript` または npm スクリプト（例: `npm run codegen` / `make codegen`）により、FastAPI のスキーマから直接型定義ファイルを生成。
2. **生成フロー**:
   - バックエンドから `openapi.json` を出力（または起動中サーバー `http://localhost:8000/openapi.json` を取得）
   - フロントエンドの `lib/types/generated/api.ts` 等へ出力
   - 既存の手動型定義から生成型への移行
3. **モデル名の用語統一**:
   - バックエンドの `Task` とフロントエンドの `Todo` などの命名差異の整理・統一

### 期待される効果
- バックエンドのスキーマ変更がフロントエンドの型エラーとして即座に検知可能になる
- 型定義の手動保守コストを削減し、API 変更への追従を高速化・安全化

---

## Task 2: GitHub Actions CI ワークフローのパスフィルター設計

### 背景・課題
モノレポ構成では、バックエンドのみの変更時にフロントエンドのビルドを走らせたり、ドキュメントのみの変更時にすべてのテストを走らせると、CI の待ち時間およびリソース消費が無駄になります。

### 目的
変更のあったディレクトリに応じて必要なジョブのみを実行するパスフィルター付きの GitHub Actions ワークフロー（`.github/workflows/ci.yml`）を構築する。

### 実装方針
1. **GitHub Actions の `paths` フィルタ または `dorny/paths-filter` アクションの活用**:
   - `backend/**` 配下に差分がある場合:
     - Python 環境セットアップ (uv)
     - `make test-backend` (`uv run pytest`)
     - `make lint-backend` (`uv run ruff check`)
   - `frontend/**` 配下に差分がある場合:
     - Node.js 環境セットアップ (npm)
     - `make lint-frontend` (`npm run lint`)
     - `make test-frontend` (`npm run build` / 型チェック)
2. **PR / main ブランチ push 時のトリガー**:
   - プルリクエスト作成時および main マージ時に自動実行

### 期待される効果
- CI 実行時間の短縮（平均待ち時間の削減）
- モノレポ内での個別リグレッション防止
