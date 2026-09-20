import { useState, useCallback, useMemo } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import {
  fetchNotes,
  createNote as createNoteAPI,
  updateNote as updateNoteAPI,
  deleteNote as deleteNoteAPI,
} from '@/lib/api/notes'
import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteCategoryFilter,
} from '@/lib/types/note'
import { toast } from 'sonner'

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
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
}
export function useNotesQuery() {
  return useQuery(noteQueries.list())
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
      toast.error('ノートの作成に失敗しました')
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
      toast.error('ノートの更新に失敗しました')
    },
  })
}
export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNoteAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
      toast.success('ノートを削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete note:', error)
      toast.error('ノートの削除に失敗しました')
    },
  })
}
/**
 * 既存コンポーネント向けの互換カスタムフック
 */
export function useNotes() {
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [categoryFilter, setCategoryFilter] =
    useState<NoteCategoryFilter>('all')
  const { data: notes = [], isLoading } = useNotesQuery()
  const createMutation = useCreateNoteMutation()
  const updateMutation = useUpdateNoteMutation()
  const deleteMutation = useDeleteNoteMutation()
  const filteredNotes = useMemo(() => {
    if (categoryFilter === 'all') return notes
    if (categoryFilter === 'uncategorized') {
      return notes.filter((note) => note.category_id === null)
    }
    return notes.filter((note) => note.category_id === categoryFilter)
  }, [notes, categoryFilter])
  const addNote = useCallback(
    async (data: CreateNoteInput) => {
      try {
        await createMutation.mutateAsync(data)
        return true
      } catch {
        return false
      }
    },
    [createMutation],
  )
  const updateNote = useCallback(
    async (id: string, data: UpdateNoteInput) => {
      try {
        await updateMutation.mutateAsync({ id, data })
        return true
      } catch {
        return false
      }
    },
    [updateMutation],
  )
  const deleteNote = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id)
        return true
      } catch {
        return false
      }
    },
    [deleteMutation],
  )
  return {
    notes,
    filteredNotes,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    editingNote,
    setEditingNote,
    viewingNote,
    setViewingNote,
    categoryFilter,
    setCategoryFilter,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: async () => {},
  }
}
