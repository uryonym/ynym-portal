import { z } from 'zod'

/**
 * アプリケーション環境変数のバリデーションスキーマ
 * Vite では import.meta.env から取得します。
 * プロキシ利用時は API_BASE_URL は空文字（相対パス）でも動作します。
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default(''),
  VITE_SITE_URL: z.string().default('http://localhost:3000'),
})

function parseEnv() {
  const parsed = envSchema.safeParse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL ?? 'http://localhost:3000',
  })

  if (!parsed.success) {
    console.error(
      '❌ 無効な環境変数が見つかりました:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error(
      '環境変数の検証に失敗しました。設定内容を確認してください。',
    )
  }

  return parsed.data
}

export const env = parseEnv()
