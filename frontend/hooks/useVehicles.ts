'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'
import {
  fetchVehicles,
  createVehicle,
  updateVehicle as updateVehicleAPI,
  deleteVehicle as deleteVehicleAPI,
} from '@/lib/api/vehicles'
import { toast } from 'sonner'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  const refreshVehicles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetchVehicles()
      setVehicles(response.data)
    } catch (error) {
      console.error('Failed to reload vehicles:', error)
      toast.error('車両一覧の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await fetchVehicles()
        if (!ignore) {
          setVehicles(response.data)
        }
      } catch (error) {
        console.error('Failed to load vehicles:', error)
        if (!ignore) {
          setVehicles([])
          toast.error('車両一覧の取得に失敗しました')
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

  const addVehicle = useCallback(
    async (data: CreateVehicleInput) => {
      setIsLoading(true)
      try {
        await createVehicle(data)
        await refreshVehicles()
        toast.success('車両を追加しました')
      } catch (error) {
        console.error('Failed to create vehicle:', error)
        toast.error('車両の追加に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [refreshVehicles],
  )

  const updateVehicle = useCallback(
    async (id: string, data: UpdateVehicleInput) => {
      setIsLoading(true)
      try {
        await updateVehicleAPI(id, data)
        await refreshVehicles()
        toast.success('車両を更新しました')
      } catch (error) {
        console.error('Failed to update vehicle:', error)
        toast.error('車両の更新に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [refreshVehicles],
  )

  const deleteVehicle = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await deleteVehicleAPI(id)
        await refreshVehicles()
        toast.success('車両を削除しました')
      } catch (error) {
        console.error('Failed to delete vehicle:', error)
        toast.error('車両の削除に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [refreshVehicles],
  )

  return {
    vehicles,
    isLoading,
    editingVehicle,
    setEditingVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  }
}
