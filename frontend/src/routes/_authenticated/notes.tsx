import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useNotes } from '@/hooks/queries/useNotes'
import { useNoteCategories } from '@/hooks/queries/useNoteCategories'
import { NoteList } from '@/components/NoteList'
import { NoteDialog } from '@/components/NoteDialog'
import { NoteDetailDialog } from '@/components/NoteDetailDialog'
import { NoteDeleteDialog } from '@/components/NoteDeleteDialog'
import { Note } from '@/lib/types/note'
import { NoteCategory } from '@/lib/types/note-category'
import { NoteFormValues } from '@/lib/validations/note'

export const Route = createFileRoute('/_authenticated/notes')({
  component: NotesPage,
})

function NotesPage() {
  const {
    filteredNotes,
    isLoading: isNotesLoading,
    editingNote,
    setEditingNote,
    viewingNote,
    setViewingNote,
    categoryFilter,
    setCategoryFilter,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes()

  const { categories, isLoading: isCategoriesLoading } = useNoteCategories()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const categoryMap = useMemo(() => {
    const map = new Map<string, NoteCategory>()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const handleAddNew = () => {
    setEditingNote(null)
    setIsFormOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsFormOpen(true)
  }

  const handleViewNote = (note: Note) => {
    setViewingNote(note)
  }

  const handleDeleteClick = (note: Note) => {
    setIsFormOpen(false)
    setViewingNote(null)
    setDeletingNote(note)
    setIsDeleteOpen(true)
  }

  const handleSubmitForm = async (data: NoteFormValues) => {
    let success: boolean
    if (editingNote) {
      success = await updateNote(editingNote.id, data)
    } else {
      success = await addNote(data)
    }
    if (success) {
      setIsFormOpen(false)
      setEditingNote(null)
    }
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
        onView={handleViewNote}
        onEdit={handleEditNote}
        onDelete={handleDeleteClick}
        isLoading={isNotesLoading || isCategoriesLoading}
      />

      <NoteDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingNote}
        categories={categories}
        onSubmit={handleSubmitForm}
        isLoading={isNotesLoading}
      />

      <NoteDetailDialog
        open={Boolean(viewingNote)}
        onOpenChange={(open) => {
          if (!open) setViewingNote(null)
        }}
        note={viewingNote}
        category={
          viewingNote?.category_id
            ? categoryMap.get(viewingNote.category_id)
            : undefined
        }
        onEdit={handleEditNote}
        onDelete={handleDeleteClick}
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
