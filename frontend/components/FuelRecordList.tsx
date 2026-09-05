'use client'

import { FuelRecord } from '@/lib/types/fuel-record'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { FuelRecordItem } from './FuelRecordItem'

interface FuelRecordListProps {
  records: FuelRecord[]
  onEdit: (record: FuelRecord) => void
  onAddNew: () => void
}

export function FuelRecordList({
  records,
  onEdit,
  onAddNew,
}: FuelRecordListProps) {
  if (!records) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">給油記録</h2>
        <Button onClick={onAddNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          新規追加
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>給油記録がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <FuelRecordItem key={record.id} record={record} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
