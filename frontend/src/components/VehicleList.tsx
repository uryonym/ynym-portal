'use client'

import { Vehicle } from '@/lib/types/vehicle'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { VehicleItem } from './VehicleItem'

interface VehicleListProps {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onAddNew: () => void
}

export function VehicleList({ vehicles, onEdit, onAddNew }: VehicleListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            車両管理
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            登録されている車両情報を管理します
          </p>
        </div>
        <Button
          onClick={onAddNew}
          className="h-10 px-4 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>車両を追加</span>
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <p className="text-sm text-slate-400">
            登録されている車両がありません
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {vehicles.map((vehicle) => (
            <VehicleItem key={vehicle.id} vehicle={vehicle} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
