import type { SuccessResponse } from './api'

export interface Note {
  id: string
  user_id: string
  category_id: string | null
  title: string
  body: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateNoteInput {
  title: string
  body: string
  category_id?: string | null
}

export interface UpdateNoteInput {
  title?: string | null
  body?: string | null
  category_id?: string | null
}

export type NoteResponse = SuccessResponse<Note>
export type NotesResponse = SuccessResponse<Note[]>
export type NoteCategoryFilter = 'all' | 'uncategorized' | string

// Re-export NoteCategory types
export type {
  NoteCategory,
  CreateNoteCategoryInput,
  UpdateNoteCategoryInput,
  NoteCategoryResponse,
  NoteCategoriesResponse,
} from './note-category'
