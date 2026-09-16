'use client'

import { useState, useCallback, useEffect } from 'react'
import { User, UserCreate, UserUpdate } from '@/lib/types/user'
import {
  listUsers,
  createUser as createUserAPI,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
  restoreUser as restoreUserAPI,
} from '@/lib/api/users'
import { ApiError } from '@/lib/api/client'
import { toast } from 'sonner'

function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiError) {
    if (
      typeof error.data === 'object' &&
      error.data !== null &&
      'detail' in error.data
    ) {
      const detail = (error.data as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
    }
    return error.message || defaultMessage
  }
  if (error instanceof Error) {
    return error.message
  }
  return defaultMessage
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [includeDeleted, setIncludeDeleted] = useState(true)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const refreshUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await listUsers({
        include_deleted: includeDeleted,
        search: search || undefined,
      })
      setUsers(data)
    } catch (error) {
      console.error('Failed to reload users:', error)
      toast.error('ユーザー一覧の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [includeDeleted, search])

  useEffect(() => {
    let ignore = false

    async function load() {
      setIsLoading(true)
      try {
        const data = await listUsers({
          include_deleted: includeDeleted,
          search: search || undefined,
        })
        if (!ignore) {
          setUsers(data)
        }
      } catch (error) {
        console.error('Failed to load users:', error)
        if (!ignore) {
          setUsers([])
          toast.error('ユーザー一覧の取得に失敗しました')
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
  }, [includeDeleted, search])

  const addUser = async (data: UserCreate) => {
    setIsLoading(true)
    try {
      const newUser = await createUserAPI(data)
      setUsers((prev) => [newUser, ...prev])
      toast.success('ユーザーを事前登録しました')
      return true
    } catch (error: unknown) {
      const msg = getErrorMessage(error, 'ユーザーの登録に失敗しました')
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userId: string, data: UserUpdate) => {
    setIsLoading(true)
    try {
      const updated = await updateUserAPI(userId, data)
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
      toast.success('ユーザー情報を更新しました')
      return true
    } catch (error: unknown) {
      const msg = getErrorMessage(error, 'ユーザー情報の更新に失敗しました')
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    setIsLoading(true)
    try {
      await deleteUserAPI(userId)
      toast.success('ユーザーを論理削除（退会）しました')
      await refreshUsers()
      return true
    } catch (error: unknown) {
      const msg = getErrorMessage(error, 'ユーザーの削除に失敗しました')
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const restoreUser = async (userId: string) => {
    setIsLoading(true)
    try {
      const restored = await restoreUserAPI(userId)
      setUsers((prev) => prev.map((u) => (u.id === userId ? restored : u)))
      toast.success('ユーザーを復元しました')
      return true
    } catch (error: unknown) {
      const msg = getErrorMessage(error, 'ユーザーの復元に失敗しました')
      toast.error(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    users,
    isLoading,
    includeDeleted,
    setIncludeDeleted,
    search,
    setSearch,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    refreshUsers,
    addUser,
    updateUser,
    deleteUser,
    restoreUser,
  }
}
