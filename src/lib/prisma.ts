import { PrismaClient } from '../../generated/client'

// globalThisにPrismaClientのインスタンスをキャッシュするための型定義
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 既存のインスタンスがあればそれを使い、なければ新しいインスタンスを作成
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // 開発環境でのみクエリログを出力したい場合
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// 本番環境以外では、作成したインスタンスをグローバルオブジェクトに保存
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
