import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { VehicleItem } from './VehicleItem'

import type { Vehicle } from '@/lib/types/vehicle'

interface VehicleListProps {
  vehicles: Vehicle[]
  onEdit: (vehicle: Vehicle) => void
  onAddNew: () => void
}
export function VehicleList({ vehicles, onEdit, onAddNew }: VehicleListProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          クルマ
        </h1>
        <Button
          onClick={onAddNew}
          className="h-9 px-3.5 gap-1.5 rounded-lg cursor-pointer text-xs sm:text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>車両を追加</span>
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-14 bg-card rounded-xl border border-border/80 p-8">
          <p className="text-sm text-muted-foreground">
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
