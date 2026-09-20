import type {
  NotesResponse,
  NoteResponse,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/lib/types/note'
import { apiClient } from './client'

export async function fetchNotes(
  skip?: number,
  limit?: number,
): Promise<NotesResponse> {
  const params = new URLSearchParams()
  if (skip !== undefined) {
    params.append('skip', skip.toString())
  }
  if (limit !== undefined) {
    params.append('limit', limit.toString())
  }
  const queryString = params.toString()
  const endpoint = queryString ? `/api/notes?${queryString}` : '/api/notes'
  return apiClient.get<NotesResponse>(endpoint)
}
export async function getNote(id: string): Promise<NoteResponse> {
  return apiClient.get<NoteResponse>(`/api/notes/${id}`)
}
export async function createNote(
  input: CreateNoteInput,
): Promise<NoteResponse> {
  return apiClient.post<NoteResponse>('/api/notes', input)
}
export async function updateNote(
  id: string,
  input: UpdateNoteInput,
): Promise<NoteResponse> {
  return apiClient.put<NoteResponse>(`/api/notes/${id}`, input)
}
export async function deleteNote(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/notes/${id}`)
}
