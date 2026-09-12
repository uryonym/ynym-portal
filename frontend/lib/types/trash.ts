import type { components } from './generated/schema'

export type TrashResourceType =
  'tasks' | 'notes' | 'note_categories' | 'vehicles' | 'fuel_records'

export type TrashSummary = components['schemas']['TrashSummary']

export type TrashSummaryResponse =
  components['schemas']['SuccessResponse_TrashSummary_']

export interface TrashListResponse<T> {
  data: T[]
  message: string
}

export interface TrashRestoreResponse<T> {
  data: T
  message: string
}

export interface EmptyTrashResponse {
  data: {
    purged_count: number
  }
  message: string
}
