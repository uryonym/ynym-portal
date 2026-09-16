'use client'

import { useState, useMemo } from 'react'
import { useNotes } from '@/hooks/useNotes'
import { useNoteCategories } from '@/hooks/useNoteCategories'
import { NoteList } from '@/components/NoteList'
import { NoteDialog } from '@/components/NoteDialog'
import { NoteDetailDialog } from '@/components/NoteDetailDialog'
import { NoteDeleteDialog } from '@/components/NoteDeleteDialog'
import { Note } from '@/lib/types/note'
import { NoteCategory } from '@/lib/types/note-category'
import { NoteFormValues } from '@/lib/validations/note'

export default function NotesPage() {
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
      success = await updateNote(editingNote.id, {
        title: data.title,
        body: data.body,
        category_id: data.category_id ? data.category_id : null,
      })
    } else {
      success = await addNote({
        title: data.title,
        body: data.body,
        category_id: data.category_id ? data.category_id : null,
      })
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
      if (viewingNote?.id === id) {
        setViewingNote(null)
      }
    }
  }

  const isLoading = isNotesLoading || isCategoriesLoading

  return (
    <>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <NoteList
          notes={filteredNotes}
          categories={categories}
          selectedFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
          onView={handleViewNote}
          onEdit={handleEditNote}
          onDelete={handleDeleteClick}
          onAddNew={handleAddNew}
          isLoading={isLoading}
        />
      </main>

      <NoteDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingNote}
        categories={categories}
        onSubmit={handleSubmitForm}
        onDelete={handleDeleteClick}
        isLoading={isNotesLoading}
      />

      <NoteDetailDialog
        open={!!viewingNote}
        onOpenChange={(open) => !open && setViewingNote(null)}
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
    </>
  )
}
