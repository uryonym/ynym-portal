'use client'
import { FuelRecordItem } from './FuelRecordItem'

import type { FuelRecord } from '@/lib/types/fuel-record'

interface FuelRecordListProps {
  records: FuelRecord[]
  onEdit: (record: FuelRecord) => void
  onAddNew?: () => void
}
export function FuelRecordList({ records, onEdit }: FuelRecordListProps) {
  return (
    <div className="space-y-3">
      {records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <p className="text-sm text-slate-400">給油記録がありません</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {records.map((record) => (
            <FuelRecordItem key={record.id} record={record} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
