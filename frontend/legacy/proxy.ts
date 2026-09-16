import { NextResponse } from 'next/server'

/**
 * Next.js 16 Proxy
 * Note: 現在はクライアント側の AuthProvider / ProtectedRoute で認証を制御しています。
 * 将来的にセッション Cookie を用いたサーバーサイドでの早期リダイレクトを行う場合はここに実装します。
 */
export async function proxy() {
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 静的アセット（_next, favicon, 拡張子付きファイル）を除外
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
