import type { SuccessResponse } from './api'

export type TrashResourceType =
  'tasks' | 'notes' | 'note_categories' | 'vehicles' | 'fuel_records'

export interface TrashSummary {
  tasks: number
  notes: number
  note_categories: number
  vehicles: number
  fuel_records: number
  total: number
}

export type TrashSummaryResponse = SuccessResponse<TrashSummary>

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
