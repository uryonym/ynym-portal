import { useState, useMemo } from 'react'

import { createFileRoute, Link } from '@tanstack/react-router'

import { FuelRecordDialog } from '@/components/FuelRecordDialog'
import { FuelRecordList } from '@/components/FuelRecordList'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFuelRecords } from '@/hooks/queries/useFuelRecords'
import { useVehicles } from '@/hooks/queries/useVehicles'

import type {
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
  FuelRecord,
} from '@/lib/types/fuel-record'

export const Route = createFileRoute('/_authenticated/fuel-records')({
  component: FuelRecordsPage,
})
function FuelRecordsPage() {
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
  // 表示用の車両名マッピング（SelectValue で ID ではなく車両名を表示するため）
  const vehicleItems = useMemo(() => {
    return Object.fromEntries(
      vehicles.map((v) => [v.id, `${v.name} (${v.maker} ${v.model})`]),
    )
  }, [vehicles])
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
  const handleSubmitForm = async (
    data: CreateFuelRecordInput | UpdateFuelRecordInput,
  ) => {
    const success = editingRecord
      ? await updateRecord(editingRecord.id, data)
      : await addRecord(data as CreateFuelRecordInput)
    if (success) {
      setIsDialogOpen(false)
    }
  }
  if (vehiclesLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full text-center py-12 text-slate-500">
        車両情報を読み込み中...
      </div>
    )
  }
  if (vehicles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full text-center py-12 space-y-4">
        <p className="text-slate-500">
          燃費記録を利用するには、まず車両を登録してください。
        </p>
        <Button render={<Link to="/vehicles" />} nativeButton={false}>
          車両管理へ
        </Button>
      </div>
    )
  }
  return (
    <>
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* ヘッダー */}
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

        {/* 車両選択セレクター */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
            車両:
          </span>
          <Select
            value={activeVehicleId ?? undefined}
            onValueChange={(val) => setSelectedVehicleId(val ?? null)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="車両を選択">
                {activeVehicleId ? vehicleItems[activeVehicleId] : '車両を選択'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} ({v.maker} {v.model})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FuelRecordList records={records} onEdit={handleEditRecord} />
      </div>

      <FuelRecordDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingRecord}
        vehicleId={activeVehicleId ?? ''}
        onSubmit={handleSubmitForm}
        onDelete={deleteRecord}
        isLoading={isLoading}
      />
    </>
  )
}
