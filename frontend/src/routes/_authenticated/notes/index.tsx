import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { NoteDeleteDialog } from '@/components/NoteDeleteDialog'
import { NoteList } from '@/components/NoteList'
import { useNoteCategories } from '@/hooks/queries/useNoteCategories'
import { useNotes } from '@/hooks/queries/useNotes'

import type { Note } from '@/lib/types/note'

export const Route = createFileRoute('/_authenticated/notes/')({
  component: NotesPage,
})

function NotesPage() {
  const navigate = useNavigate()
  const {
    filteredNotes,
    isLoading: isNotesLoading,
    categoryFilter,
    setCategoryFilter,
    deleteNote,
  } = useNotes()
  const { categories, isLoading: isCategoriesLoading } = useNoteCategories()

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

  const handleDeleteClick = (note: Note) => {
    setDeletingNote(note)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async (id: string) => {
    const success = await deleteNote(id)
    if (success) {
      setIsDeleteOpen(false)
      setDeletingNote(null)
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
        isLoading={isNotesLoading || isCategoriesLoading}
      />

      <NoteDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        note={deletingNote}
        onConfirm={handleConfirmDelete}
        isLoading={isNotesLoading}
      />
    </div>
  )
}
