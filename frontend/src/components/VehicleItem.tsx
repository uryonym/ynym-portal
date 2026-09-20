'use client'
import { Pencil, Car } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Vehicle } from '@/lib/types/vehicle'

interface VehicleItemProps {
  vehicle: Vehicle
  onEdit: (vehicle: Vehicle) => void
}
export function VehicleItem({ vehicle, onEdit }: VehicleItemProps) {
  return (
    <div className="group flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
                {vehicle.name}
              </h3>
              <p className="text-xs text-slate-500">
                {vehicle.maker} {vehicle.model}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(vehicle)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
            aria-label="編集"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
          <div className="bg-slate-50/70 p-1.5 rounded-lg">
            <span className="block text-[10px] text-slate-400">年式</span>
            <span className="font-medium text-slate-700">
              {vehicle.year ? `${vehicle.year}年` : '-'}
            </span>
          </div>
          <div className="bg-slate-50/70 p-1.5 rounded-lg">
            <span className="block text-[10px] text-slate-400">ナンバー</span>
            <span className="font-medium text-slate-700">
              {vehicle.number || '-'}
            </span>
          </div>
          <div className="bg-slate-50/70 p-1.5 rounded-lg">
            <span className="block text-[10px] text-slate-400">タンク</span>
            <span className="font-medium text-slate-700">
              {vehicle.tank_capacity ? `${vehicle.tank_capacity}L` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
