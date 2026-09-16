import { useState, useCallback } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import {
  fetchVehicles,
  createVehicle as createVehicleAPI,
  updateVehicle as updateVehicleAPI,
  deleteVehicle as deleteVehicleAPI,
} from '@/lib/api/vehicles'
import {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'
import { toast } from 'sonner'

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
}

export const vehicleQueries = {
  list: () =>
    queryOptions({
      queryKey: vehicleKeys.lists(),
      queryFn: async () => {
        const response = await fetchVehicles()
        return response.data
      },
    }),
}

export function useVehiclesQuery() {
  return useQuery(vehicleQueries.list())
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVehicleInput) => createVehicleAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
      toast.success('車両を登録しました')
    },
    onError: (error) => {
      console.error('Failed to create vehicle:', error)
      toast.error('車両の登録に失敗しました')
    },
  })
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleInput }) =>
      updateVehicleAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
      toast.success('車両情報を更新しました')
    },
    onError: (error) => {
      console.error('Failed to update vehicle:', error)
      toast.error('車両情報の更新に失敗しました')
    },
  })
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVehicleAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
      toast.success('車両を削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete vehicle:', error)
      toast.error('車両の削除に失敗しました')
    },
  })
}

/**
 * 既存コンポーネント向けの互換カスタムフック
 */
export function useVehicles() {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  const { data: vehicles = [], isLoading } = useVehiclesQuery()
  const createMutation = useCreateVehicleMutation()
  const updateMutation = useUpdateVehicleMutation()
  const deleteMutation = useDeleteVehicleMutation()

  const addVehicle = useCallback(
    async (data: CreateVehicleInput) => {
      try {
        await createMutation.mutateAsync(data)
        return true
      } catch {
        return false
      }
    },
    [createMutation],
  )

  const updateVehicle = useCallback(
    async (id: string, data: UpdateVehicleInput) => {
      try {
        await updateMutation.mutateAsync({ id, data })
        return true
      } catch {
        return false
      }
    },
    [updateMutation],
  )

  const deleteVehicle = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id)
        return true
      } catch {
        return false
      }
    },
    [deleteMutation],
  )

  return {
    vehicles,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    editingVehicle,
    setEditingVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refreshVehicles: async () => {},
  }
}
