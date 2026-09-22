import type { SuccessResponse } from './api'

export interface NoteCategory {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateNoteCategoryInput {
  name: string
}

export interface UpdateNoteCategoryInput {
  name?: string | null
}

export type NoteCategoryResponse = SuccessResponse<NoteCategory>
export type NoteCategoriesResponse = SuccessResponse<NoteCategory[]>
