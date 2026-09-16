# プロジェクト共通 AI エージェント指示書

本リポジトリで作業するすべての AI エージェント（Antigravity, Cursor, Copilot, Claude Code 等）は以下の指示に従ってください。

## 言語指示

- **常に日本語で応答・説明・出力**してください。

## プロジェクト概要とモノレポ構成

本リポジトリは、FastAPI バックエンドと Vite + TanStack SPA フロントエンドを統合したモノレポ構成です。

- **`backend/`**: FastAPI (Python 3.12, uv)
  - BFF 認証: Google OAuth + HttpOnly Cookie / セッション一元管理
  - パッケージ管理: `uv`
  - ORM: SQLAlchemy 2.0 (`psycopg`)
  - テスト: `pytest`
  - リント・フォーマット: `ruff`
- **`frontend/`**: Vite SPA (Node.js 24, React 19, TypeScript, npm)
  - ルーティング: TanStack Router (`@tanstack/react-router`)
  - 状態・データ取得: TanStack Query (`@tanstack/react-query`)
  - UI: Tailwind CSS v4, shadcn/ui (Base UI)
  - リント・フォーマット: `eslint`, `prettier`
- **ランタイム管理**: `asdf`（`.tool-versions`）※ `mise` は使用しません
- **タスクランナー**: ルートの `Makefile`（`make dev`, `make test`, `make lint`, `make format`）

## Git コミットメッセージ規約

コミットメッセージは必ず以下のフォーマットを遵守してください（詳細は [`.github/copilot-instructions.md`](.github/copilot-instructions.md) 参照）。

- **フォーマット**: `タグ: コミットメッセージ`
- **利用可能なタグ**:
  - `feature`: 機能追加・更新
  - `fix`: バグ修正
  - `refactor`: リファクタリング
  - `docs`: ドキュメント
- **言語**: 必ず**日本語**で記述すること
- **文字数制限**: **50文字以内**で簡潔にまとめること

## 開発上の重要ルール

1. **API パス**:
   - バックエンドの API ルータはすべて `/api` プレフィックス配下にマウントされています。
   - フロントエンドからの API リクエストも必ず `/api/...` を呼び出してください。
2. **環境変数**:
   - バックエンド: `backend/.env`
   - フロントエンド: `frontend/.env.local`
3. **コマンド実行**:
   - 基本的なテスト・リント・開発起動はルートの `make` コマンドを使用してください。
4. **shadcn/ui 管理コンポーネントの修正禁止**:
   - `frontend/src/components/ui/` 配下のコンポーネントは shadcn/ui CLI によって生成・管理されるコンポーネントです。
   - AI エージェントが勝手に独自改変・拡張を行わないでください（公式 CLI から取得した状態を維持すること）。
   - 振る舞いやアクセシビリティの調整は、コンポーネント自体の改修ではなく、呼び出し元（Page や Feature コンポーネント側）のプロップス指定（例: `render` や `nativeButton={false}` 等）で行ってください。
