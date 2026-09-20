import { useState, useCallback } from 'react'

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  fetchCategories,
  createCategory as createCategoryAPI,
  updateCategory as updateCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from '@/lib/api/note-categories'

import type {
  NoteCategory,
  CreateNoteCategoryInput,
  UpdateNoteCategoryInput,
} from '@/lib/types/note-category'

export const noteCategoryKeys = {
  all: ['note-categories'] as const,
  lists: () => [...noteCategoryKeys.all, 'list'] as const,
}
export const noteCategoryQueries = {
  list: () =>
    queryOptions({
      queryKey: noteCategoryKeys.lists(),
      queryFn: async () => {
        const response = await fetchCategories()
        return response.data
      },
    }),
}
export function useNoteCategoriesQuery() {
  return useQuery(noteCategoryQueries.list())
}
export function useCreateNoteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNoteCategoryInput) => createCategoryAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteCategoryKeys.all })
      toast.success('カテゴリを作成しました')
    },
    onError: (error) => {
      console.error('Failed to create note category:', error)
      toast.error('カテゴリの作成に失敗しました')
    },
  })
}
export function useUpdateNoteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteCategoryInput }) =>
      updateCategoryAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteCategoryKeys.all })
      toast.success('カテゴリを更新しました')
    },
    onError: (error) => {
      console.error('Failed to update note category:', error)
      toast.error('カテゴリの更新に失敗しました')
    },
  })
}
export function useDeleteNoteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategoryAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteCategoryKeys.all })
      toast.success('カテゴリを削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete note category:', error)
      toast.error('カテゴリの削除に失敗しました')
    },
  })
}
/**
 * 既存コンポーネント向けの互換カスタムフック
 */
export function useNoteCategories() {
  const [editingCategory, setEditingCategory] = useState<NoteCategory | null>(
    null,
  )
  const { data: categories = [], isLoading } = useNoteCategoriesQuery()
  const { mutateAsync: createCategoryAsync, isPending: isCreatePending } =
    useCreateNoteCategoryMutation()
  const { mutateAsync: updateCategoryAsync, isPending: isUpdatePending } =
    useUpdateNoteCategoryMutation()
  const { mutateAsync: deleteCategoryAsync, isPending: isDeletePending } =
    useDeleteNoteCategoryMutation()
  const addCategory = useCallback(
    async (data: CreateNoteCategoryInput) => {
      try {
        await createCategoryAsync(data)
        return true
      } catch {
        return false
      }
    },
    [createCategoryAsync],
  )
  const updateCategory = useCallback(
    async (id: string, data: UpdateNoteCategoryInput) => {
      try {
        await updateCategoryAsync({ id, data })
        return true
      } catch {
        return false
      }
    },
    [updateCategoryAsync],
  )
  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await deleteCategoryAsync(id)
        return true
      } catch {
        return false
      }
    },
    [deleteCategoryAsync],
  )
  return {
    categories,
    isLoading:
      isLoading || isCreatePending || isUpdatePending || isDeletePending,
    editingCategory,
    setEditingCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: async () => {},
  }
}
