import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetchMembers, updateMyColor } from '@/lib/api/members'

import type { MemberColorUpdate } from '@/lib/types/member'

export const memberKeys = {
  all: ['members'] as const,
  list: () => [...memberKeys.all, 'list'] as const,
}

export const memberQueries = {
  list: () =>
    queryOptions({
      queryKey: memberKeys.list(),
      queryFn: async () => {
        const response = await fetchMembers()
        return response.data
      },
    }),
}

export function useMembersQuery() {
  return useQuery(memberQueries.list())
}

export function useUpdateMyColorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: MemberColorUpdate) => updateMyColor(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('メンバー色を更新しました')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'メンバー色の更新に失敗しました')
    },
  })
}
