import type { components } from './generated/schema'

export type User = components['schemas']['UserResponse']
export type UserCreate = components['schemas']['UserCreate']
export type UserUpdate = components['schemas']['UserUpdate']

// Auth-related user state
export type AuthUser = User | null

// For authentication status
export type AuthState = {
  user: AuthUser
  isLoading: boolean
  error: string | null
}

export type LogoutResponse = components['schemas']['MessageResponse']
export type MessageResponse = components['schemas']['MessageResponse']
export type UserListResponse =
  components['schemas']['SuccessResponse_list_UserResponse__']
export type UserSingleResponse =
  components['schemas']['SuccessResponse_UserResponse_']
