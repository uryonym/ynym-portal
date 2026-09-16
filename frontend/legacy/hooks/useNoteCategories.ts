'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  NoteCategory,
  CreateNoteCategoryInput,
  UpdateNoteCategoryInput,
} from '@/lib/types/note-category'
import {
  fetchCategories,
  createCategory as createCategoryAPI,
  updateCategory as updateCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from '@/lib/api/note-categories'
import { ApiError } from '@/lib/api/client'
import { toast } from 'sonner'

export function useNoteCategories() {
  const [categories, setCategories] = useState<NoteCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<NoteCategory | null>(
    null,
  )

  const refreshCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to reload note categories:', error)
      toast.error('カテゴリ一覧の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await fetchCategories()
        if (!ignore) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error('Failed to load note categories:', error)
        if (!ignore) {
          setCategories([])
          toast.error('カテゴリ一覧の取得に失敗しました')
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

  const addCategory = useCallback(
    async (data: CreateNoteCategoryInput): Promise<boolean> => {
      setIsLoading(true)
      try {
        await createCategoryAPI(data)
        await refreshCategories()
        toast.success('カテゴリを作成しました')
        return true
      } catch (error) {
        console.error('Failed to create note category:', error)
        toast.error('カテゴリの作成に失敗しました')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshCategories],
  )

  const updateCategory = useCallback(
    async (id: string, data: UpdateNoteCategoryInput): Promise<boolean> => {
      setIsLoading(true)
      try {
        await updateCategoryAPI(id, data)
        await refreshCategories()
        toast.success('カテゴリを更新しました')
        return true
      } catch (error) {
        console.error('Failed to update note category:', error)
        toast.error('カテゴリの更新に失敗しました')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshCategories],
  )

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true)
      try {
        await deleteCategoryAPI(id)
        await refreshCategories()
        toast.success('カテゴリを削除しました')
        return true
      } catch (error) {
        console.error('Failed to delete note category:', error)
        if (error instanceof ApiError && error.status === 409) {
          const message =
            (error.data as { message?: string } | undefined)?.message ??
            'ノートが存在するためカテゴリを削除できません'
          toast.error(message)
        } else {
          toast.error('カテゴリの削除に失敗しました')
        }
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshCategories],
  )

  return {
    categories,
    isLoading,
    editingCategory,
    setEditingCategory,
    refreshCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
