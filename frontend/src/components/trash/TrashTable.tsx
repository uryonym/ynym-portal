'use client'
import {
  RotateCcw,
  Trash2,
  Calendar,
  FileText,
  CheckSquare,
  Folder,
  Car,
  Fuel,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatDisplayDateTime } from '@/lib/date'

import type { TrashResourceType } from '@/lib/types/trash'

export interface BaseTrashItem {
  id: string
  deleted_at?: string | null
  title?: string
  name?: string
  description?: string | null
  body?: string | null
  due_date?: string | null
  maker?: string | null
  model?: string | null
  number?: string | null
  refuel_datetime?: string | null
  fuel_type?: string | null
  total_cost?: number | null
  total_mileage?: number | null
  gas_station_name?: string | null
}
interface TrashTableProps {
  resourceType: TrashResourceType
  items: BaseTrashItem[]
  isLoading: boolean
  onRestore: (id: string, name: string) => void
  onPurge: (id: string, name: string) => void
  restoringId: string | null
  purgingId: string | null
}
export function TrashTable({
  resourceType,
  items,
  isLoading,
  onRestore,
  onPurge,
  restoringId,
  purgingId,
}: TrashTableProps) {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-slate-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-800 mb-2" />
        <p className="text-sm">読み込み中...</p>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <Trash2 className="mx-auto h-10 w-10 text-slate-300 mb-3" />
        <p className="text-base font-medium text-slate-700">ゴミ箱は空です</p>
        <p className="text-xs text-slate-400 mt-1">
          削除されたアイテムはありません
        </p>
      </div>
    )
  }
  // リソースに応じたアイテム情報の抽出
  const getItemDetails = (item: BaseTrashItem) => {
    switch (resourceType) {
      case 'tasks':
        return {
          icon: CheckSquare,
          name: item.title || '無題のタスク',
          subInfo: item.description
            ? item.description.slice(0, 60) +
              (item.description.length > 60 ? '...' : '')
            : null,
          badge: item.due_date ? `期日: ${item.due_date}` : null,
        }
      case 'notes':
        return {
          icon: FileText,
          name: item.title || '無題のノート',
          subInfo: item.body
            ? item.body.slice(0, 80) + (item.body.length > 80 ? '...' : '')
            : null,
          badge: null,
        }
      case 'note_categories':
        return {
          icon: Folder,
          name: item.name || '無題のカテゴリ',
          subInfo: null,
          badge: 'カテゴリ',
        }
      case 'vehicles':
        return {
          icon: Car,
          name: item.name || '無題の車両',
          subInfo: `${item.maker || ''} ${item.model || ''}`.trim() || null,
          badge: item.number || null,
        }
      case 'fuel_records':
        return {
          icon: Fuel,
          name: `給油記録: ${formatDisplayDateTime(item.refuel_datetime)}`,
          subInfo: `${item.fuel_type || ''} / ${(item.total_cost || 0).toLocaleString()}円 (${(item.total_mileage || 0).toLocaleString()}km)`,
          badge: item.gas_station_name || null,
        }
      default:
        return {
          icon: Trash2,
          name: item.id,
          subInfo: null,
          badge: null,
        }
    }
  }
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
      <ul className="divide-y divide-slate-100">
        {items.map((item) => {
          const details = getItemDetails(item)
          const Icon = details.icon
          const isRestoring = restoringId === item.id
          const isPurging = purgingId === item.id
          return (
            <li
              key={item.id}
              className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {details.name}
                    </h3>
                    {details.badge && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {details.badge}
                      </span>
                    )}
                  </div>
                  {details.subInfo && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {details.subInfo}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      削除日時:{' '}
                      {formatDisplayDateTime(
                        item.deleted_at,
                        'yyyy/MM/dd HH:mm',
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore(item.id, details.name)}
                  disabled={isRestoring || isPurging}
                  className="cursor-pointer gap-1.5 text-xs text-slate-700 hover:text-slate-900"
                >
                  <RotateCcw
                    className={`h-3.5 w-3.5 ${isRestoring ? 'animate-spin' : ''}`}
                  />
                  {isRestoring ? '復元中...' : '復元'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onPurge(item.id, details.name)}
                  disabled={isRestoring || isPurging}
                  className="cursor-pointer gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  完全削除
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
