'use client'

import { useState } from 'react'
import { useNoteCategories } from '@/hooks/useNoteCategories'
import { NoteCategoryList } from '@/components/NoteCategoryList'
import { NoteCategoryDialog } from '@/components/NoteCategoryDialog'
import { NoteCategoryDeleteDialog } from '@/components/NoteCategoryDeleteDialog'
import { NoteCategory } from '@/lib/types/note-category'
import { NoteCategoryFormValues } from '@/lib/validations/note-category'

export default function NoteCategoriesPage() {
  const {
    categories,
    isLoading,
    editingCategory,
    setEditingCategory,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useNoteCategories()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<NoteCategory | null>(
    null,
  )
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleAddNew = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const handleEditCategory = (category: NoteCategory) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (category: NoteCategory) => {
    setIsFormOpen(false)
    setDeletingCategory(category)
    setIsDeleteOpen(true)
  }

  const handleSubmitForm = async (data: NoteCategoryFormValues) => {
    let success: boolean
    if (editingCategory) {
      success = await updateCategory(editingCategory.id, data)
    } else {
      success = await addCategory(data)
    }
    if (success) {
      setIsFormOpen(false)
      setEditingCategory(null)
    }
  }

  const handleConfirmDelete = async (id: string) => {
    const success = await deleteCategory(id)
    if (success) {
      setIsDeleteOpen(false)
      setDeletingCategory(null)
    }
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <NoteCategoryList
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteClick}
          onAddNew={handleAddNew}
          isLoading={isLoading}
        />
      </main>

      <NoteCategoryDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingCategory}
        onSubmit={handleSubmitForm}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      <NoteCategoryDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </>
  )
}
