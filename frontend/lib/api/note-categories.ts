import {
  NoteCategoriesResponse,
  NoteCategoryResponse,
  CreateNoteCategoryInput,
  UpdateNoteCategoryInput,
} from '@/lib/types/note-category'
import { apiClient } from './client'

export async function fetchCategories(
  skip?: number,
  limit?: number,
): Promise<NoteCategoriesResponse> {
  const params = new URLSearchParams()
  if (skip !== undefined) {
    params.append('skip', skip.toString())
  }
  if (limit !== undefined) {
    params.append('limit', limit.toString())
  }
  const queryString = params.toString()
  const endpoint = queryString
    ? `/api/note-categories?${queryString}`
    : '/api/note-categories'

  return apiClient.get<NoteCategoriesResponse>(endpoint)
}

export async function createCategory(
  input: CreateNoteCategoryInput,
): Promise<NoteCategoryResponse> {
  return apiClient.post<NoteCategoryResponse>('/api/note-categories', input)
}

export async function updateCategory(
  id: string,
  input: UpdateNoteCategoryInput,
): Promise<NoteCategoryResponse> {
  return apiClient.put<NoteCategoryResponse>(
    `/api/note-categories/${id}`,
    input,
  )
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/note-categories/${id}`)
}
