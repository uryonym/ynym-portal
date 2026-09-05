'use client'

import { Vehicle } from '@/lib/types/vehicle'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VehicleItemProps {
  vehicle: Vehicle
  onEdit: (vehicle: Vehicle) => void
}

export function VehicleItem({ vehicle, onEdit }: VehicleItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-900">
            {vehicle.name}
          </h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {vehicle.maker} {vehicle.model}
          </span>
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <p>年式: {vehicle.year}年</p>
          <p>ナンバー: {vehicle.number}</p>
          <p>タンク容量: {vehicle.tank_capacity}L</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(vehicle)}
        className="h-8 w-8 p-0 shrink-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  )
}
