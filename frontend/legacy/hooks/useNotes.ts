'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteCategoryFilter,
} from '@/lib/types/note'
import {
  fetchNotes,
  createNote as createNoteAPI,
  updateNote as updateNoteAPI,
  deleteNote as deleteNoteAPI,
} from '@/lib/api/notes'
import { toast } from 'sonner'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [categoryFilter, setCategoryFilter] =
    useState<NoteCategoryFilter>('all')

  const refreshNotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchNotes()
      setNotes(response.data)
    } catch (error) {
      console.error('Failed to reload notes:', error)
      toast.error('ノート一覧の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await fetchNotes()
        if (!ignore) {
          setNotes(response.data)
        }
      } catch (error) {
        console.error('Failed to load notes:', error)
        if (!ignore) {
          setNotes([])
          toast.error('ノート一覧の取得に失敗しました')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (categoryFilter === 'all') return true
      if (categoryFilter === 'uncategorized') return !note.category_id
      return note.category_id === categoryFilter
    })
  }, [notes, categoryFilter])

  const addNote = useCallback(
    async (data: CreateNoteInput): Promise<boolean> => {
      setIsLoading(true)
      try {
        await createNoteAPI(data)
        await refreshNotes()
        toast.success('ノートを作成しました')
        return true
      } catch (error) {
        console.error('Failed to create note:', error)
        toast.error('ノートの作成に失敗しました')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshNotes],
  )

  const updateNote = useCallback(
    async (id: string, data: UpdateNoteInput): Promise<boolean> => {
      setIsLoading(true)
      try {
        await updateNoteAPI(id, data)
        await refreshNotes()
        toast.success('ノートを更新しました')
        return true
      } catch (error) {
        console.error('Failed to update note:', error)
        toast.error('ノートの更新に失敗しました')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshNotes],
  )

  const deleteNote = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true)
      try {
        await deleteNoteAPI(id)
        await refreshNotes()
        toast.success('ノートを削除しました')
        return true
      } catch (error) {
        console.error('Failed to delete note:', error)
        toast.error('ノートの削除に失敗しました')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshNotes],
  )

  return {
    notes,
    filteredNotes,
    isLoading,
    editingNote,
    setEditingNote,
    viewingNote,
    setViewingNote,
    categoryFilter,
    setCategoryFilter,
    refreshNotes,
    addNote,
    updateNote,
    deleteNote,
  }
}
