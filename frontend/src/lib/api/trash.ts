import { apiClient } from './client'

import type {
  TrashResourceType,
  TrashSummaryResponse,
  TrashListResponse,
  TrashRestoreResponse,
  EmptyTrashResponse,
} from '@/lib/types/trash'

export async function fetchTrashSummary(): Promise<TrashSummaryResponse> {
  return apiClient.get<TrashSummaryResponse>('/api/trash/summary')
}
export async function fetchTrashItems<T>(
  resourceType: TrashResourceType,
  skip = 0,
  limit = 100,
): Promise<TrashListResponse<T>> {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  })
  return apiClient.get<TrashListResponse<T>>(
    `/api/trash/${resourceType}?${params.toString()}`,
  )
}
export async function restoreTrashItem<T>(
  resourceType: TrashResourceType,
  id: string,
): Promise<TrashRestoreResponse<T>> {
  return apiClient.post<TrashRestoreResponse<T>>(
    `/api/trash/${resourceType}/${id}/restore`,
  )
}
export async function purgeTrashItem(
  resourceType: TrashResourceType,
  id: string,
): Promise<void> {
  return apiClient.delete<void>(`/api/trash/${resourceType}/${id}`)
}
export async function emptyTrash(
  resourceType: TrashResourceType,
): Promise<EmptyTrashResponse> {
  return apiClient.delete<EmptyTrashResponse>(`/api/trash/${resourceType}`)
}
