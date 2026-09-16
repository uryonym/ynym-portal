import {
  LogoutResponse,
  User,
  UserCreate,
  UserListResponse,
  UserSingleResponse,
  UserUpdate,
} from '@/lib/types/user'
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

export interface ListUsersParams {
  skip?: number
  limit?: number
  include_deleted?: boolean
  search?: string
}

export async function listUsers(params: ListUsersParams = {}): Promise<User[]> {
  const searchParams = new URLSearchParams()
  if (params.skip !== undefined)
    searchParams.append('skip', params.skip.toString())
  if (params.limit !== undefined)
    searchParams.append('limit', params.limit.toString())
  if (params.include_deleted !== undefined)
    searchParams.append('include_deleted', params.include_deleted.toString())
  if (params.search) searchParams.append('search', params.search)

  const query = searchParams.toString()
  const endpoint = query ? `/api/users?${query}` : '/api/users'
  const res = await apiClient.get<UserListResponse>(endpoint)
  return res.data
}

export async function createUser(payload: UserCreate): Promise<User> {
  const res = await apiClient.post<UserSingleResponse>('/api/users', payload)
  return res.data
}

export async function getUser(userId: string): Promise<User> {
  const res = await apiClient.get<UserSingleResponse>(`/api/users/${userId}`)
  return res.data
}

export async function updateUser(
  userId: string,
  payload: UserUpdate,
): Promise<User> {
  const res = await apiClient.put<UserSingleResponse>(
    `/api/users/${userId}`,
    payload,
  )
  return res.data
}

export async function deleteUser(userId: string): Promise<void> {
  await apiClient.delete<void>(`/api/users/${userId}`)
}

export async function restoreUser(userId: string): Promise<User> {
  const res = await apiClient.post<UserSingleResponse>(
    `/api/users/${userId}/restore`,
  )
  return res.data
}
