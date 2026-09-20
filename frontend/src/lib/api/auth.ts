import { apiClient, ApiError } from '@/lib/api/client'
import { AUTH_ME_URL, GOOGLE_AUTH_LOGIN_URL, LOGOUT_URL } from '@/lib/constants'

import type { MessageResponse, User } from '@/lib/types/user'

/**
 * 現在ログイン中のユーザー情報を取得
 * 未認証 (401) の場合は null を返す
 */
export async function fetchCurrentAuthUser(): Promise<User | null> {
  try {
    return await apiClient.get<User>(AUTH_ME_URL)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

/**
 * ログアウトを実行（セッションクッキー削除）
 */
export async function logoutUser(): Promise<MessageResponse> {
  return apiClient.post<MessageResponse>(LOGOUT_URL)
}

/**
 * Google ログイン URL を生成
 */
export function getGoogleLoginUrl(redirectTo?: string): string {
  if (!redirectTo) {
    return GOOGLE_AUTH_LOGIN_URL
  }
  const url = new URL(GOOGLE_AUTH_LOGIN_URL, window.location.origin)
  url.searchParams.set('redirect_to', redirectTo)
  return url.toString()
}
