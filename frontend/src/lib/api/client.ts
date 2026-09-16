import { API_BASE_URL } from '@/lib/constants'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers = new Headers(options.headers)

  let body: BodyInit | undefined = undefined
  if (options.body !== undefined) {
    if (
      typeof options.body === 'string' ||
      options.body instanceof FormData ||
      options.body instanceof Blob
    ) {
      body = options.body
    } else {
      headers.set('Content-Type', 'application/json')
      body = JSON.stringify(options.body)
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? 'include',
    body,
  })

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      // JSONでパースできない場合は無視
    }
    throw new ApiError(
      response.status,
      `API error: ${response.status} ${response.statusText}`,
      errorData,
    )
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as unknown as T
  }

  return JSON.parse(text) as T
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T = void>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method'>,
  ) => request<T>(endpoint, { ...options, method: 'DELETE' }),
}
