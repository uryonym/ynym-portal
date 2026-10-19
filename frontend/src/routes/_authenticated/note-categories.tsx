import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { NoteCategoryDeleteDialog } from '@/components/NoteCategoryDeleteDialog'
import { NoteCategoryDialog } from '@/components/NoteCategoryDialog'
import { NoteCategoryList } from '@/components/NoteCategoryList'
import {
  useNoteCategoriesQuery,
  useCreateNoteCategoryMutation,
  useUpdateNoteCategoryMutation,
  useDeleteNoteCategoryMutation,
} from '@/hooks/queries/useNoteCategories'

import type { NoteCategory } from '@/lib/types/note-category'
import type { NoteCategoryFormValues } from '@/lib/validations/note-category'

export const Route = createFileRoute('/_authenticated/note-categories')({
  component: NoteCategoriesPage,
})

function NoteCategoriesPage() {
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useNoteCategoriesQuery()
  const createMutation = useCreateNoteCategoryMutation()
  const updateMutation = useUpdateNoteCategoryMutation()
  const deleteMutation = useDeleteNoteCategoryMutation()

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  const [editingCategory, setEditingCategory] = useState<NoteCategory | null>(
    null,
  )
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
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsFormOpen(false)
      setEditingCategory(null)
    } catch {
      // エラーは mutation 内の onError で処理
    }
  }

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      setIsDeleteOpen(false)
      setDeletingCategory(null)
    } catch {
      // エラーは mutation 内の onError で処理
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <NoteCategoryList
        categories={categories}
        onAddNew={handleAddNew}
        onEdit={handleEditCategory}
        onDelete={handleDeleteClick}
        isLoading={isCategoriesLoading}
      />

      <NoteCategoryDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingCategory}
        onSubmit={handleSubmitForm}
        isLoading={isMutating}
      />

      <NoteCategoryDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
      />
    </div>
  )
}
