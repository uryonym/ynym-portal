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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              燃費管理
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              給油履歴と燃費を記録します
            </p>
          </div>
          {activeVehicleId && (
            <Button
              onClick={handleOpenDialog}
              className="h-10 px-4 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
            >
              <span>給油を記録</span>
            </Button>
          )}
        </div>

        {vehiclesLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-4">
            <p className="text-sm text-slate-500">
              燃費を記録するには、先に車両を登録してください。
            </p>
            <Button
              render={<Link href="/vehicles" />}
              nativeButton={false}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
            >
              車両管理へ
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vehicle Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                表示中の車両
              </label>
              <div className="flex-1 max-w-xs">
                <Select
                  value={activeVehicleId || ''}
                  onValueChange={(val) => setSelectedVehicleId(val)}
                >
                  <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200 rounded-lg text-sm">
                    <SelectValue placeholder="車両を選択" />
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
            </div>

            {activeVehicleId && (
              <FuelRecordList records={records} onEdit={handleEditRecord} />
            )}
          </div>
        )}
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
