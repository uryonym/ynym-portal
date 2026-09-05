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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">登録済みの車両</h2>
        <Button onClick={onAddNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          新規登録
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>登録済みの車両がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <VehicleItem key={vehicle.id} vehicle={vehicle} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
