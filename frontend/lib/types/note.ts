import type { components } from './generated/schema'

// Note
export type Note = components['schemas']['NoteResponse']
export type CreateNoteInput = components['schemas']['NoteCreate']
export type UpdateNoteInput = components['schemas']['NoteUpdate']
export type NoteResponse =
  components['schemas']['SuccessResponse_NoteResponse_']
export type NotesResponse =
  components['schemas']['SuccessResponse_list_NoteResponse__']

// Re-export NoteCategory types
export type {
  NoteCategory,
  CreateNoteCategoryInput,
  UpdateNoteCategoryInput,
  NoteCategoryResponse,
  NoteCategoriesResponse,
} from './note-category'
