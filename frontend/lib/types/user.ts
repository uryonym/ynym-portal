import type { components } from './generated/schema'

export type User = components['schemas']['UserResponse']

// Auth-related user state
export type AuthUser = User | null

// For authentication status
export type AuthState = {
  user: AuthUser
  isLoading: boolean
  error: string | null
}

export type LogoutResponse = components['schemas']['MessageResponse']
