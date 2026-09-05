'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useVehicles } from '@/hooks/useVehicles'
import { useFuelRecords } from '@/hooks/useFuelRecords'
import { FuelRecordList } from '@/components/FuelRecordList'
import { FuelRecordDialog } from '@/components/FuelRecordDialog'
import {
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
  FuelRecord,
} from '@/lib/types/fuel-record'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function FuelRecordsPage() {
  const { vehicles, isLoading: vehiclesLoading } = useVehicles()

  // seqが最大の車両IDを計算
  const defaultVehicleId = useMemo(() => {
    if (vehicles.length === 0) return null
    const vehicleWithMaxSeq = vehicles.reduce((max, vehicle) =>
      vehicle.seq > max.seq ? vehicle : max,
    )
    return vehicleWithMaxSeq.id
  }, [vehicles])

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  )

  // 選択中の車両ID（未選択の場合はデフォルトを使用）
  const activeVehicleId = selectedVehicleId ?? defaultVehicleId

  const {
    records,
    isLoading,
    editingRecord,
    setEditingRecord,
    addRecord,
    updateRecord,
    deleteRecord,
  } = useFuelRecords(activeVehicleId)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setEditingRecord(null)
    setIsDialogOpen(true)
  }

  const handleEditRecord = (recordToEdit: FuelRecord) => {
    setEditingRecord(recordToEdit)
    setIsDialogOpen(true)
  }

  const handleSubmitForm = (
    data: CreateFuelRecordInput | UpdateFuelRecordInput,
  ) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data as UpdateFuelRecordInput)
    } else {
      addRecord(data as CreateFuelRecordInput)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">燃費管理</h1>

          {vehiclesLoading ? (
            <p className="text-center text-gray-500 py-8">読み込み中...</p>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                燃費記録を開始するには、先に車両を登録してください。
              </p>
              <Button asChild>
                <Link href="/vehicles">車両管理へ</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  対象車両を選択
                </label>
                <Select
                  value={activeVehicleId || ''}
                  onValueChange={(val) => setSelectedVehicleId(val)}
                >
                  <SelectTrigger className="w-full h-10 bg-white">
                    <SelectValue placeholder="車両を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.maker} {vehicle.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeVehicleId && (
                <FuelRecordList
                  records={records}
                  onEdit={handleEditRecord}
                  onAddNew={handleOpenDialog}
                />
              )}
            </>
          )}
        </div>
      </main>

      {activeVehicleId && (
        <FuelRecordDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          vehicleId={activeVehicleId}
          initialData={editingRecord}
          onSubmit={handleSubmitForm}
          onDelete={deleteRecord}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
