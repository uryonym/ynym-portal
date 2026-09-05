import { LogoutResponse, User } from '@/lib/types/user'
import { apiClient, ApiError } from './client'

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await apiClient.get<User>('/api/users/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

export async function logoutUser(): Promise<LogoutResponse> {
  return apiClient.post<LogoutResponse>('/api/auth/logout')
}
