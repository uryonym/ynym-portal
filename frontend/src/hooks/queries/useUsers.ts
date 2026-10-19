import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import {
  listUsers,
  createUser as createUserAPI,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
  restoreUser as restoreUserAPI,
} from '@/lib/api/users'

import type { UserCreate, UserUpdate } from '@/lib/types/user'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: { include_deleted: boolean; search?: string }) =>
    [...userKeys.lists(), params] as const,
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

export function useUsersQuery(
  params: {
    include_deleted: boolean
    search?: string
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    ...userQueries.list(params),
    ...options,
  })
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
      toast.error(getApiErrorMessage(error, 'ユーザーの作成に失敗しました'))
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
      toast.error(getApiErrorMessage(error, 'ユーザー情報の更新に失敗しました'))
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
      toast.error(getApiErrorMessage(error, 'ユーザーの無効化に失敗しました'))
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
      toast.error(getApiErrorMessage(error, 'ユーザーの復元に失敗しました'))
    },
  })
}
