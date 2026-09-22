import type { SuccessResponse, MessageResponse } from './api'

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string | null
  google_uid: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface UserCreate {
  google_uid: string
  email: string
  name: string
  is_admin?: boolean
}

export interface UserUpdate {
  name?: string | null
  email?: string | null
  google_uid?: string | null
  is_admin?: boolean | null
}

// Auth-related user state
export type AuthUser = User | null

// For authentication status
export interface AuthState {
  user: AuthUser
  isLoading: boolean
  error: string | null
}

export type LogoutResponse = MessageResponse
export type { MessageResponse }
export type UserResponse = SuccessResponse<User>
export type UserSingleResponse = SuccessResponse<User>
export type UserListResponse = SuccessResponse<User[]>
export type UsersResponse = SuccessResponse<User[]>
