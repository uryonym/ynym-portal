# ynym Portal Frontend

`ynym-portal` 向けの Next.js フロントエンドアプリケーション。

## 主な機能・特徴

- **Next.js 16 (App Router)**: モダンな React Server Components & クライアントコンポーネント構成
- **React 19**: 最新の React 機能と UI 状態管理
- **UI / スタイリング**: Tailwind CSS v4, shadcn/ui, Radix UI による統一感のあるコンポーネント設計
- **認証連携**: Google OAuth 認証、セッション管理、ProtectedRoute によるルート保護
- **機能画面**:
  - 車両管理 (Vehicles)
  - 給油記録管理 (Fuel Records)
  - タスク管理 (Tasks / Todos)
- **フォーム & バリデーション**: `react-hook-form` + `zod` による型安全な入力検証

## 前提条件

- Node.js `24.19.0` (asdf で管理)
- npm (Node.js に同梱)

## クイックスタート

本リポジトリのルートディレクトリから `make` コマンドで一括起動することも可能です（詳細はルートの [README.md](../README.md) を参照）。  
個別でフロントエンドを操作する場合は、`frontend` ディレクトリで以下の手順を行います。

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成し、バックエンド API の接続先を設定します。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

## スクリプト一覧

| コマンド               | 説明                                         |
| :--------------------- | :------------------------------------------- |
| `npm run dev`          | 開発サーバーを起動 (Turbopack)               |
| `npm run build`        | プロダクション用ビルドおよび型チェックを実行 |
| `npm run start`        | ビルド成果物をプロダクションモードで起動     |
| `npm run lint`         | ESLint によるコード静的解析                  |
| `npm run format`       | Prettier によるコード自動整形                |
| `npm run format:check` | Prettier による整形チェック                  |

## プロジェクト構成

```text
frontend/
├── app/                  # Next.js App Router ページ・レイアウト
│   ├── (auth)/          # 認証関連ページ (ログイン等)
│   ├── (dashboard)/     # ダッシュボード・業務画面 (要認証)
│   ├── layout.tsx       # ルートレイアウト
│   └── globals.css      # グローバル CSS (Tailwind CSS)
├── components/           # UI コンポーネント (共通UI, 各機能Dialog/Form)
├── hooks/                # カスタムフック (SWR/データフェッチ, 状態管理)
├── lib/                  # 共通ユーティリティ, APIクライアント, 型定義, バリデーション
│   ├── api/             # バックエンド API クライアント
│   ├── types/           # TypeScript 型定義
│   └── validations/     # Zod スキーマ
├── providers/            # React Context プロバイダー (認証など)
├── public/               # 静的アセット
├── Dockerfile            # Docker ビルド定義 (standalone 出力)
├── package.json          # 依存関係定義
└── tsconfig.json         # TypeScript 設定
```
