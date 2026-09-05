// types/user.ts

export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string // ISO 8601 datetime string
}

// Auth-related user state
export type AuthUser = User | null

// For authentication status
export type AuthState = {
  user: AuthUser
  isLoading: boolean
  error: string | null
}

export type LogoutResponse = {
  message: string
}
