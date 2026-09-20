import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import {
  fetchTrashSummary,
  fetchTrashItems,
  restoreTrashItem as restoreTrashItemAPI,
  purgeTrashItem as purgeTrashItemAPI,
  emptyTrash as emptyTrashAPI,
} from '@/lib/api/trash'
import type { TrashResourceType, TrashSummary } from '@/lib/types/trash'
import type { BaseTrashItem } from '@/components/trash/TrashTable'
import { toast } from 'sonner'

export const trashKeys = {
  all: ['trash'] as const,
  summary: () => [...trashKeys.all, 'summary'] as const,
  items: (resourceType: TrashResourceType) =>
    [...trashKeys.all, 'items', resourceType] as const,
}
export const trashQueries = {
  summary: () =>
    queryOptions<TrashSummary>({
      queryKey: trashKeys.summary(),
      queryFn: async () => {
        const res = await fetchTrashSummary()
        return res.data
      },
    }),
  items: (resourceType: TrashResourceType) =>
    queryOptions<BaseTrashItem[]>({
      queryKey: trashKeys.items(resourceType),
      queryFn: async () => {
        const res = await fetchTrashItems<BaseTrashItem>(resourceType)
        return res.data
      },
    }),
}
export function useTrashSummaryQuery() {
  return useQuery(trashQueries.summary())
}
export function useTrashItemsQuery(resourceType: TrashResourceType) {
  return useQuery(trashQueries.items(resourceType))
}
export function useRestoreTrashMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      resourceType,
      id,
    }: {
      resourceType: TrashResourceType
      id: string
    }) => restoreTrashItemAPI(resourceType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trashKeys.all })
      toast.success('復元しました')
    },
    onError: (error) => {
      console.error('Failed to restore trash item:', error)
      toast.error('復元に失敗しました')
    },
  })
}
export function usePurgeTrashMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      resourceType,
      id,
    }: {
      resourceType: TrashResourceType
      id: string
    }) => purgeTrashItemAPI(resourceType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trashKeys.all })
      toast.success('完全に削除しました')
    },
    onError: (error) => {
      console.error('Failed to purge trash item:', error)
      toast.error('完全削除に失敗しました')
    },
  })
}
export function useEmptyTrashMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (resourceType: TrashResourceType) =>
      emptyTrashAPI(resourceType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trashKeys.all })
      toast.success('ゴミ箱を空にしました')
    },
    onError: (error) => {
      console.error('Failed to empty trash:', error)
      toast.error('ゴミ箱を空にできませんでした')
    },
  })
}
