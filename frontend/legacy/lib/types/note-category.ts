import type { components } from './generated/schema'

export type NoteCategory = components['schemas']['NoteCategoryResponse']
export type CreateNoteCategoryInput =
  components['schemas']['NoteCategoryCreate']
export type UpdateNoteCategoryInput =
  components['schemas']['NoteCategoryUpdate']
export type NoteCategoryResponse =
  components['schemas']['SuccessResponse_NoteCategoryResponse_']
export type NoteCategoriesResponse =
  components['schemas']['SuccessResponse_list_NoteCategoryResponse__']
