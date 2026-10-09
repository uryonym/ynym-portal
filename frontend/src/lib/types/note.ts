import type { SuccessResponse } from './api'

export interface Note {
  id: string
  user_id: string
  category_id: string | null
  title: string
  body: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateNoteInput {
  title: string
  body: string
  category_id?: string | null
  is_pinned?: boolean
}

export interface UpdateNoteInput {
  title?: string | null
  body?: string | null
  category_id?: string | null
  is_pinned?: boolean
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
