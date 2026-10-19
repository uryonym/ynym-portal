import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import {
  fetchNotes,
  getNote as getNoteAPI,
  createNote as createNoteAPI,
  updateNote as updateNoteAPI,
  deleteNote as deleteNoteAPI,
} from '@/lib/api/notes'

import type { CreateNoteInput, UpdateNoteInput } from '@/lib/types/note'

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
}
export const noteQueries = {
  list: () =>
    queryOptions({
      queryKey: noteKeys.lists(),
      queryFn: async () => {
        const response = await fetchNotes()
        return response.data
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: noteKeys.detail(id),
      queryFn: async () => {
        const response = await getNoteAPI(id)
        return response.data
      },
      enabled: Boolean(id),
    }),
}
export function useNotesQuery() {
  return useQuery(noteQueries.list())
}
export function useNoteQuery(id: string) {
  return useQuery(noteQueries.detail(id))
}
export function useCreateNoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNoteInput) => createNoteAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      toast.success('ノートを作成しました')
    },
    onError: (error) => {
      console.error('Failed to create note:', error)
      toast.error(getApiErrorMessage(error, 'ノートの作成に失敗しました'))
    },
  })
}
export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput }) =>
      updateNoteAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      toast.success('ノートを更新しました')
    },
    onError: (error) => {
      console.error('Failed to update note:', error)
      toast.error(getApiErrorMessage(error, 'ノートの更新に失敗しました'))
    },
  })
}
export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNoteAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('ノートを削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete note:', error)
      toast.error(getApiErrorMessage(error, 'ノートの削除に失敗しました'))
    },
  })
}
