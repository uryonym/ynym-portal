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

---

## Task 3: ユーザー管理機能およびアカウント退会時の論理削除・データ取り扱いポリシーの実装

**関連 Issue**: [#8](https://github.com/uryonym/ynym-portal/issues/8)

### 背景・課題
現在のシステムにはユーザーの作成・参照（`/users/me`）のみが存在し、ユーザー情報の管理機能やアカウント退会（ユーザー削除）機能が存在しません。

### 目的・検討内容
1. ユーザー管理機能（プロフィール編集、アカウント削除等）の API および UI 設計
2. `User` モデルへの論理削除フィールド（`SoftDeleteMixin` / `deleted_at`）の導入検討
3. アカウント退会時の関連データ（Task, Vehicle, FuelRecord, Note, NoteCategory）の取り扱いポリシー策定（カスケード論理削除 or 保持 or 個人情報マスキング）
4. 退会済みユーザーの認証・ログイン遮断処理の実装

---

## Task 4: 論理削除データのゴミ箱機能（一覧・復元・完全削除）の実装

**関連 Issue**: [#9](https://github.com/uryonym/ynym-portal/issues/9)

### 背景・課題
各主導データに論理削除が導入されましたが、現状は削除 API 呼び出し時に `deleted_at` を設定して通常の一覧から除外するのみとなっています。  
誤って削除してしまったデータの復旧や、不要データの完全消去を行えるようにするためのゴミ箱・復元機能が求められます。

### 目的・検討内容
1. 論理削除されたデータを一覧取得するゴミ箱用 API の設計・実装（例: `GET /api/trash` または `?include_deleted=true` 等）
2. 論理削除されたデータを元に戻す復元 API の設計・実装（`deleted_at = None` への更新、親データ削除時の復元制約考慮）
3. 不要となったデータを物理削除する完全削除（Purge）API またはバッチ処理（一定日数経過後の自動削除等）の設計・実装
4. フロントエンドでのゴミ箱画面・復元・完全削除 UI の実装
