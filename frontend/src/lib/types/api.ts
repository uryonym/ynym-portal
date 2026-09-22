export interface SuccessResponse<T> {
  data: T
  message: string
}

export interface MessageResponse {
  message: string
}

export interface ErrorResponse {
  detail: string
  status_code: number
  error_type?: string | null
}

export interface ApiResponse<T> {
  data: T
  message: string
}
