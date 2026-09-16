# Frontend AI Agent Rules

プロジェクト全体の共通指示はルートの [AGENTS.md](../AGENTS.md) を参照してください。

## 技術スタック

- **ビルドツール**: Vite
- **フレームワーク**: React 19 (SPA)
- **ルーティング**: TanStack Router (`@tanstack/react-router`)
  - ルート定義は `src/routes/` 配下でファイルベースルーティングを実施
  - ルートツリー `src/routeTree.gen.ts` は Vite ビルドまたは開発サーバー起動時に自動生成
- **状態・データ取得**: TanStack Query (`@tanstack/react-query`)
  - クエリキーやクエリオプションは `src/hooks/queries/` 配下に定義
- **スタイリング**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **コンポーネント**: shadcn/ui (`src/components/ui/`)

## 開発上の重要ルール

1. **shadcn/ui コンポーネントの改変禁止**:
   - `src/components/ui/` 配下のコンポーネントは shadcn/ui 管理のため、直接改変・独自拡張せず、公式のコード状態を維持してください。
   - 振る舞いやアクセシビリティの制御は、呼び出し元側の props（`render`, `nativeButton={false}` 等）で行ってください。
2. **API 通信**:
   - API リクエストはすべて `/api/...` を呼び出してください（ローカル開発時は Vite のプロキシによりバックエンドへ転送されます）。
   - クライアント側でトークンを直接扱わず、HttpOnly Cookie による BFF 認証を利用します。
