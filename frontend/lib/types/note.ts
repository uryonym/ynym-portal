import type { components } from './generated/schema'

// Note
export type Note = components['schemas']['NoteResponse']
export type CreateNoteInput = components['schemas']['NoteCreate']
export type UpdateNoteInput = components['schemas']['NoteUpdate']
export type NoteResponse =
  components['schemas']['SuccessResponse_NoteResponse_']
export type NotesResponse =
  components['schemas']['SuccessResponse_list_NoteResponse__']

// NoteCategory
export type NoteCategory = components['schemas']['NoteCategoryResponse']
export type CreateNoteCategoryInput =
  components['schemas']['NoteCategoryCreate']
export type UpdateNoteCategoryInput =
  components['schemas']['NoteCategoryUpdate']
export type NoteCategoryResponse =
  components['schemas']['SuccessResponse_NoteCategoryResponse_']
export type NoteCategoriesResponse =
  components['schemas']['SuccessResponse_list_NoteCategoryResponse__']
