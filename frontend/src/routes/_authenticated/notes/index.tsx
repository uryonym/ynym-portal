import { useState, useMemo } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { NoteDeleteDialog } from '@/components/NoteDeleteDialog'
import { NoteList } from '@/components/NoteList'
import { useNoteCategoriesQuery } from '@/hooks/queries/useNoteCategories'
import {
  useNotesQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '@/hooks/queries/useNotes'

import type { Note, NoteCategoryFilter } from '@/lib/types/note'

export const Route = createFileRoute('/_authenticated/notes/')({
  component: NotesPage,
})

function NotesPage() {
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] =
    useState<NoteCategoryFilter>('all')

  const { data: notes = [], isLoading: isNotesLoading } = useNotesQuery()
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useNoteCategoriesQuery()

  const updateMutation = useUpdateNoteMutation()
  const deleteMutation = useDeleteNoteMutation()

  const filteredNotes = useMemo(() => {
    if (categoryFilter === 'all') return notes
    if (categoryFilter === 'uncategorized') {
      return notes.filter((note) => note.category_id === null)
    }
    return notes.filter((note) => note.category_id === categoryFilter)
  }, [notes, categoryFilter])

  const [deletingNote, setDeletingNote] = useState<Note | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddNew = () => {
    navigate({ to: '/notes/new' })
  }

  const handleOpenNote = (note: Note) => {
    navigate({
      to: '/notes/$noteId',
      params: { noteId: note.id },
    })
  }

  const handleTogglePin = (note: Note) => {
    updateMutation.mutate({
      id: note.id,
      data: { is_pinned: !note.is_pinned },
    })
  }

  const handleDeleteClick = (note: Note) => {
    setDeletingNote(note)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      setIsDeleteOpen(false)
      setDeletingNote(null)
    } catch {
      // エラーは mutation 内の onError で処理
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <NoteList
        notes={filteredNotes}
        categories={categories}
        selectedFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
        onAddNew={handleAddNew}
        onView={handleOpenNote}
        onEdit={handleOpenNote}
        onDelete={handleDeleteClick}
        onTogglePin={handleTogglePin}
        isLoading={isNotesLoading || isCategoriesLoading}
      />

      <NoteDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        note={deletingNote}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
