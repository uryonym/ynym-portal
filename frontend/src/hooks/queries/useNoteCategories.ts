import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import {
  fetchCategories,
  createCategory as createCategoryAPI,
  updateCategory as updateCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from '@/lib/api/note-categories'

import type {
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
      toast.error(getApiErrorMessage(error, 'カテゴリの作成に失敗しました'))
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
      toast.error(getApiErrorMessage(error, 'カテゴリの更新に失敗しました'))
    },
  })
}
export function useDeleteNoteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategoryAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteCategoryKeys.all })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('カテゴリを削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete note category:', error)
      toast.error(getApiErrorMessage(error, 'カテゴリの削除に失敗しました'))
    },
  })
}
