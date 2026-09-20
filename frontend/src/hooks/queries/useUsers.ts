import { useState, useCallback } from 'react'

import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { ApiError } from '@/lib/api/client'
import {
  listUsers,
  createUser as createUserAPI,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
  restoreUser as restoreUserAPI,
} from '@/lib/api/users'

import type { User, UserCreate, UserUpdate } from '@/lib/types/user'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: { include_deleted: boolean; search?: string }) =>
    [...userKeys.lists(), params] as const,
}
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof ApiError) {
    if (
      typeof error.data === 'object' &&
      error.data !== null &&
      'detail' in error.data
    ) {
      const detail = error.data.detail
      if (typeof detail === 'string') return detail
    }
    return error.message || defaultMessage
  }
  if (error instanceof Error) {
    return error.message
  }
  return defaultMessage
}
export const userQueries = {
  list: (params: { include_deleted: boolean; search?: string }) =>
    queryOptions({
      queryKey: userKeys.list(params),
      queryFn: async () => {
        return listUsers(params)
      },
    }),
}
export function useUsersQuery(params: {
  include_deleted: boolean
  search?: string
}) {
  return useQuery(userQueries.list(params))
}
export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserCreate) => createUserAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('ユーザーを作成しました')
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
      toast.error(getErrorMessage(error, 'ユーザーの作成に失敗しました'))
    },
  })
}
export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
      updateUserAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('ユーザー情報を更新しました')
    },
    onError: (error) => {
      console.error('Failed to update user:', error)
      toast.error(getErrorMessage(error, 'ユーザー情報の更新に失敗しました'))
    },
  })
}
export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUserAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('ユーザーを無効化しました')
    },
    onError: (error) => {
      console.error('Failed to delete user:', error)
      toast.error(getErrorMessage(error, 'ユーザーの無効化に失敗しました'))
    },
  })
}
export function useRestoreUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => restoreUserAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success('ユーザーを復元しました')
    },
    onError: (error) => {
      console.error('Failed to restore user:', error)
      toast.error(getErrorMessage(error, 'ユーザーの復元に失敗しました'))
    },
  })
}
/**
 * 既存コンポーネント向けの互換カスタムフック
 */
export function useUsers() {
  const [includeDeleted, setIncludeDeleted] = useState(true)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const { data: users = [], isLoading } = useUsersQuery({
    include_deleted: includeDeleted,
    search: search || undefined,
  })
  const { mutateAsync: createUserAsync, isPending: isCreatePending } =
    useCreateUserMutation()
  const { mutateAsync: updateUserAsync, isPending: isUpdatePending } =
    useUpdateUserMutation()
  const { mutateAsync: deleteUserAsync, isPending: isDeletePending } =
    useDeleteUserMutation()
  const { mutateAsync: restoreUserAsync, isPending: isRestorePending } =
    useRestoreUserMutation()
  const addUser = useCallback(
    async (data: UserCreate) => {
      try {
        await createUserAsync(data)
        return true
      } catch {
        return false
      }
    },
    [createUserAsync],
  )
  const updateUser = useCallback(
    async (id: string, data: UserUpdate) => {
      try {
        await updateUserAsync({ id, data })
        return true
      } catch {
        return false
      }
    },
    [updateUserAsync],
  )
  const deleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUserAsync(id)
        return true
      } catch {
        return false
      }
    },
    [deleteUserAsync],
  )
  const restoreUser = useCallback(
    async (id: string) => {
      try {
        await restoreUserAsync(id)
        return true
      } catch {
        return false
      }
    },
    [restoreUserAsync],
  )
  return {
    users,
    isLoading:
      isLoading ||
      isCreatePending ||
      isUpdatePending ||
      isDeletePending ||
      isRestorePending,
    includeDeleted,
    setIncludeDeleted,
    search,
    setSearch,
    editingUser,
    setEditingUser,
    deletingUser,
    setDeletingUser,
    addUser,
    updateUser,
    deleteUser,
    restoreUser,
    refreshUsers: async () => {},
  }
}
