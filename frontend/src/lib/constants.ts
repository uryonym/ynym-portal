import { env } from '@/lib/env'

export const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL
export const SITE_URL = env.NEXT_PUBLIC_SITE_URL

// ---  Auth URLs from API contract ---
export const GOOGLE_AUTH_LOGIN_URL = `${API_BASE_URL}/api/auth/google/login`
export const GOOGLE_AUTH_CALLBACK_URL = `${API_BASE_URL}/api/auth/google/callback`
export const USERS_ME_URL = `${API_BASE_URL}/api/users/me`
export const LOGOUT_URL = `${API_BASE_URL}/api/auth/logout`

// ---  App constants ---
export const APP_NAME = 'ynym portal'

// ---  Domain constants ---
export const FUEL_TYPES = ['レギュラー', 'ハイオク', '軽油', '電気'] as const
export type FuelType = (typeof FUEL_TYPES)[number]

export const VEHICLE_YEAR_MIN = 1900
export const VEHICLE_YEAR_MAX = 2100
