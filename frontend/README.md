# ynym Portal Frontend

`ynym-portal` 向けの Vite + React 19 SPA フロントエンドアプリケーション。

## 主な機能・特徴

- **Vite 6**: 超高速な HMR と最適化された Rollup バンドル
- **React 19**: 最新の React 機能と UI 状態管理
- **TanStack Router**: ファイルベースの完全型安全ルーティング、および `beforeLoad` による BFF 認証ガード
- **TanStack Query**: サーバー状態のキャッシュ、バックグラウンドフェッチ、楽観的更新
- **UI / スタイリング**: Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui
- **認証連携 (BFF)**: FastAPI による BFF 認証 (Google OAuth + HttpOnly JWT Cookie)
- **機能画面**:
  - ダッシュボード (ホーム)
  - タスク管理 (Tasks)
  - ノート管理 (Notes / NoteCategories)
  - 車両管理 (Vehicles)
  - 給油記録管理 (FuelRecords)
  - ゴミ箱 (Trash: 論理削除データの復元・完全削除)
  - ユーザー管理 (Users: 管理者専用)
- **フォーム & バリデーション**: `react-hook-form` + `zod` による型安全な入力検証

## 前提条件

- Node.js `24.19.0` (asdf で管理)
- npm (Node.js に同梱)

## クイックスタート

本リポジトリのルートディレクトリから `make` コマンドで一括起動可能です（詳細はルートの [README.md](../README.md) を参照）。  
個別でフロントエンドを操作する場合は、`frontend` ディレクトリで以下の手順を行います。

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、必要に応じて設定します（デフォルトで Vite の開発プロキシが `/api` -> `http://localhost:8000` に転送するため、通常は設定不要です）。

```env
# 任意（本番ビルド時や別ホスト接続時）
VITE_API_BASE_URL=http://localhost:8000
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

## スクリプト一覧

| コマンド               | 説明                                                        |
| :--------------------- | :---------------------------------------------------------- |
| `npm run dev`          | Vite 開発サーバーを起動 (ポート 3000)                       |
| `npm run build`        | TypeScript 型チェックおよび Vite プロダクションビルドを実行 |
| `npm run preview`      | ビルド成果物をローカルでプレビュー起動                      |
| `npm run lint`         | ESLint によるコード静的解析                                 |
| `npm run format`       | Prettier によるコード自動整形                               |
| `npm run format:check` | Prettier による整形チェック                                 |
| `npm run codegen`      | OpenAPI スキーマから TypeScript 型定義を自動生成            |

## プロジェクト構成

```text
src/
├── components/          # UI コンポーネント (共通 / 業務別 / shadcn ui)
│   └── ui/              # shadcn/ui 管理コンポーネント (独自改変禁止)
├── hooks/               # カスタムフック (queries/ に TanStack Query フック)
├── lib/                 # API クライアント、ユーティリティ、型定義、バリデーション
├── routes/              # TanStack Router ファイルベースルーティング
│   ├── __root.tsx       # ルートルート (QueryClient, Toaster, Devtools)
│   ├── auth.tsx         # ログイン画面
│   ├── _authenticated.tsx # 認証ガードレイアウト (AppSidebar, Header)
│   └── _authenticated/  # 認証済み業務画面群
├── routeTree.gen.ts     # 自動生成ルートツリー
├── App.tsx              # アプリケーションルート (RouterProvider)
├── main.tsx             # エントリポイント
└── index.css            # グローバルスタイル (Tailwind CSS v4)
```
