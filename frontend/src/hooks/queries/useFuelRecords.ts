import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { getApiErrorMessage } from '@/lib/api/client'
import {
  fetchFuelRecords,
  createFuelRecord as createFuelRecordAPI,
  updateFuelRecord as updateFuelRecordAPI,
  deleteFuelRecord as deleteFuelRecordAPI,
} from '@/lib/api/fuel-records'

import type {
  FuelRecord,
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
} from '@/lib/types/fuel-record'

export const fuelRecordKeys = {
  all: ['fuel-records'] as const,
  lists: () => [...fuelRecordKeys.all, 'list'] as const,
  list: (vehicleId: string | null) =>
    [...fuelRecordKeys.lists(), { vehicleId }] as const,
}
function sortFuelRecords(records: FuelRecord[]): FuelRecord[] {
  return [...records].sort((a, b) => {
    return (
      new Date(b.refuel_datetime).getTime() -
      new Date(a.refuel_datetime).getTime()
    )
  })
}
export const fuelRecordQueries = {
  list: (vehicleId: string | null) =>
    queryOptions({
      queryKey: fuelRecordKeys.list(vehicleId),
      queryFn: async () => {
        if (!vehicleId) return []
        const response = await fetchFuelRecords(vehicleId)
        return sortFuelRecords(response.data)
      },
      enabled: Boolean(vehicleId),
    }),
}
export function useFuelRecordsQuery(vehicleId: string | null) {
  return useQuery(fuelRecordQueries.list(vehicleId))
}
export function useCreateFuelRecordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFuelRecordInput) => createFuelRecordAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelRecordKeys.all })
      toast.success('給油記録を登録しました')
    },
    onError: (error) => {
      console.error('Failed to create fuel record:', error)
      toast.error(getApiErrorMessage(error, '給油記録の登録に失敗しました'))
    },
  })
}
export function useUpdateFuelRecordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuelRecordInput }) =>
      updateFuelRecordAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelRecordKeys.all })
      toast.success('給油記録を更新しました')
    },
    onError: (error) => {
      console.error('Failed to update fuel record:', error)
      toast.error(getApiErrorMessage(error, '給油記録の更新に失敗しました'))
    },
  })
}
export function useDeleteFuelRecordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFuelRecordAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fuelRecordKeys.all })
      queryClient.invalidateQueries({ queryKey: ['trash'] })
      toast.success('給油記録を削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete fuel record:', error)
      toast.error(getApiErrorMessage(error, '給油記録の削除に失敗しました'))
    },
  })
}
