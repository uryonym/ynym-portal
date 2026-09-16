'use client'

import { FuelRecord } from '@/lib/types/fuel-record'
import { Pencil, Fuel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDisplayDateTime } from '@/lib/date'

interface FuelRecordItemProps {
  record: FuelRecord
  onEdit: (record: FuelRecord) => void
}

export function FuelRecordItem({ record, onEdit }: FuelRecordItemProps) {
  const refuelDate = formatDisplayDateTime(record.refuel_datetime)

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header line */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Fuel className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            {refuelDate}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
            {record.fuel_type}
          </span>
          {record.is_full_tank && (
            <span className="text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md">
              満タン
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          <span>
            総走行:{' '}
            <strong className="font-semibold text-slate-800">
              {record.total_mileage.toLocaleString()}
            </strong>{' '}
            km
          </span>
          {record.distance_traveled != null && (
            <span>
              走行:{' '}
              <strong className="font-semibold text-slate-800">
                {record.distance_traveled.toLocaleString()}
              </strong>{' '}
              km
            </span>
          )}
          {record.fuel_amount != null && (
            <span>
              給油量:{' '}
              <strong className="font-semibold text-slate-800">
                {record.fuel_amount.toFixed(2)}
              </strong>{' '}
              L
            </span>
          )}
          <span>
            合計:{' '}
            <strong className="font-semibold text-slate-800">
              ¥{record.total_cost.toLocaleString()}
            </strong>
          </span>
          {record.unit_price != null && (
            <span className="text-slate-400">(¥{record.unit_price}/L)</span>
          )}
        </div>

        {record.gas_station_name && (
          <p className="text-[11px] text-slate-400">
            {record.gas_station_name}
          </p>
        )}
      </div>

      {/* Fuel efficiency badge & edit button */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {record.fuel_efficiency != null ? (
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block">燃費</span>
            <span className="text-base font-bold text-slate-900">
              {record.fuel_efficiency.toFixed(2)}
              <span className="text-xs font-normal text-slate-500 ml-0.5">
                km/L
              </span>
            </span>
          </div>
        ) : (
          <div />
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(record)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
          aria-label="編集"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
