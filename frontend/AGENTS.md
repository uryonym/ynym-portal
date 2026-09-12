# Frontend AI Agent Rules

プロジェクト全体の共通指示はルートの [AGENTS.md](../AGENTS.md) を参照してください。

## shadcn/ui コンポーネントに関する注意

- `components/ui/` 配下のコンポーネントは shadcn/ui 管理のため、直接改変・独自拡張せず、公式のコード状態を維持してください。
- 振る舞いやアクセシビリティの制御は、呼び出し元側の props（`render`, `nativeButton={false}` 等）で行ってください。

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
