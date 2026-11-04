import { useState, useMemo } from 'react'

import { createFileRoute, Link } from '@tanstack/react-router'

import { FuelRecordDialog } from '@/components/fuel-records/FuelRecordDialog'
import { FuelRecordList } from '@/components/fuel-records/FuelRecordList'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useFuelRecordsQuery,
  useCreateFuelRecordMutation,
  useUpdateFuelRecordMutation,
  useDeleteFuelRecordMutation,
} from '@/hooks/queries/useFuelRecords'
import { useVehiclesQuery } from '@/hooks/queries/useVehicles'

import type {
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
  FuelRecord,
} from '@/lib/types/fuel-record'

export const Route = createFileRoute('/_authenticated/fuel-records')({
  component: FuelRecordsPage,
})

function FuelRecordsPage() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehiclesQuery()

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

  const { data: records = [] } = useFuelRecordsQuery(activeVehicleId)
  const createMutation = useCreateFuelRecordMutation()
  const updateMutation = useUpdateFuelRecordMutation()
  const deleteMutation = useDeleteFuelRecordMutation()

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null)
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
    try {
      if (editingRecord) {
        await updateMutation.mutateAsync({ id: editingRecord.id, data })
      } else {
        await createMutation.mutateAsync(data as CreateFuelRecordInput)
      }
      setIsDialogOpen(false)
    } catch {
      // エラーは mutation 内の onError で処理
    }
  }

  const handleDeleteRecord = (id: string) => {
    deleteMutation.mutate(id)
  }
  if (vehiclesLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full text-center py-12 text-muted-foreground text-sm">
        読み込み中...
      </div>
    )
  }
  if (vehicles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto w-full text-center py-14 bg-card rounded-xl border border-border/80 space-y-4">
        <p className="text-sm text-muted-foreground">
          先に車両を登録してください
        </p>
        <Button render={<Link to="/vehicles" />} nativeButton={false} size="sm">
          クルマへ
        </Button>
      </div>
    )
  }
  return (
    <>
      <div className="max-w-4xl mx-auto w-full space-y-5">
        {/* ヘッダー */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            給油・燃費
          </h1>
          {activeVehicleId && (
            <Button
              onClick={handleOpenDialog}
              className="h-9 px-3.5 gap-1.5 rounded-lg cursor-pointer text-xs sm:text-sm font-medium"
            >
              <span>給油を記録</span>
            </Button>
          )}
        </div>

        {/* 車両選択セレクター */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            車両:
          </span>
          <Select
            value={activeVehicleId ?? undefined}
            onValueChange={(val) => setSelectedVehicleId(val ?? null)}
          >
            <SelectTrigger className="w-[260px] bg-card">
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
        onDelete={handleDeleteRecord}
        isLoading={isMutating}
      />
    </>
  )
}
