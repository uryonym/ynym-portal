import { z } from 'zod'

/**
 * アプリケーション環境変数のバリデーションスキーマ
 * Next.js の仕様上、クライアントサイドで環境変数をインライン化させるため、
 * safeParse には process.env.NEXT_PUBLIC_... を明示的に渡しています。
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url('NEXT_PUBLIC_API_BASE_URL は有効な URL 形式である必要があります')
    .default('http://localhost:8000'),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL は有効な URL 形式である必要があります')
    .default('http://localhost:3000'),
})

function parseEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  })

  if (!parsed.success) {
    console.error(
      '❌ 無効な環境変数が見つかりました:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('環境変数の検証に失敗しました。設定内容を確認してください。')
  }

  return parsed.data
}

export const env = parseEnv()
