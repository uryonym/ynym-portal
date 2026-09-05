'use client'

import { FuelRecord } from '@/lib/types/fuel-record'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDisplayDateTime } from '@/lib/date'

interface FuelRecordItemProps {
  record: FuelRecord
  onEdit: (record: FuelRecord) => void
}

export function FuelRecordItem({ record, onEdit }: FuelRecordItemProps) {
  const refuelDate = formatDisplayDateTime(record.refuel_datetime)

  return (
    <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-900">{refuelDate}</h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {record.fuel_type}
          </span>
          {record.is_full_tank && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
              満タン
            </span>
          )}
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>総走行距離: {record.total_mileage.toLocaleString()}km</span>
            {record.distance_traveled != null && (
              <span>
                走行距離: {record.distance_traveled.toLocaleString()}km
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>単価: ¥{record.unit_price.toLocaleString()}</span>
            <span>合計: ¥{record.total_cost.toLocaleString()}</span>
            {record.fuel_amount != null && (
              <span>給油量: {record.fuel_amount.toFixed(2)}L</span>
            )}
          </div>
          {record.fuel_efficiency != null && (
            <p className="font-medium text-blue-600">
              燃費: {record.fuel_efficiency.toFixed(2)}km/L
            </p>
          )}
          {record.gas_station_name && (
            <p>スタンド: {record.gas_station_name}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(record)}
        className="h-8 w-8 p-0 shrink-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  )
}
