'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  FuelRecord,
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
} from '@/lib/types/fuel-record'
import {
  fetchFuelRecords,
  createFuelRecord,
  updateFuelRecord as updateFuelRecordAPI,
  deleteFuelRecord as deleteFuelRecordAPI,
} from '@/lib/api/fuel-records'
import { toast } from 'sonner'

// 燃費記録のソート関数（給油日時の降順）
function sortFuelRecords(records: FuelRecord[]): FuelRecord[] {
  return [...records].sort((a, b) => {
    return (
      new Date(b.refuel_datetime).getTime() -
      new Date(a.refuel_datetime).getTime()
    )
  })
}

export function useFuelRecords(vehicleId: string | null) {
  const [records, setRecords] = useState<FuelRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null)

  const sortedRecords = useMemo(() => sortFuelRecords(records), [records])

  const refreshRecords = useCallback(async () => {
    if (!vehicleId) return
    setIsLoading(true)
    try {
      const response = await fetchFuelRecords(vehicleId)
      setRecords(response.data)
    } catch (error) {
      console.error('Failed to reload fuel records:', error)
      toast.error('燃費記録の再取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [vehicleId])

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!vehicleId) {
        setRecords([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetchFuelRecords(vehicleId)
        if (!ignore) {
          setRecords(response.data)
        }
      } catch (error) {
        console.error('Failed to load fuel records:', error)
        if (!ignore) {
          setRecords([])
          toast.error('燃費記録の取得に失敗しました')
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
  }, [vehicleId])

  const addRecord = useCallback(
    async (data: CreateFuelRecordInput) => {
      setIsLoading(true)
      try {
        await createFuelRecord(data)
        await refreshRecords()
        toast.success('燃費記録を追加しました')
      } catch (error) {
        console.error('Failed to create fuel record:', error)
        toast.error('燃費記録の追加に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [refreshRecords],
  )

  const updateRecord = useCallback(
    async (id: string, data: UpdateFuelRecordInput) => {
      setIsLoading(true)
      try {
        await updateFuelRecordAPI(id, data)
        await refreshRecords()
        toast.success('燃費記録を更新しました')
      } catch (error) {
        console.error('Failed to update fuel record:', error)
        toast.error('燃費記録の更新に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [refreshRecords],
  )

  const deleteRecord = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await deleteFuelRecordAPI(id)
        await refreshRecords()
        toast.success('燃費記録を削除しました')
      } catch (error) {
        console.error('Failed to delete fuel record:', error)
        toast.error('燃費記録の削除に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [refreshRecords],
  )

  return {
    records: sortedRecords,
    isLoading,
    editingRecord,
    setEditingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
  }
}
