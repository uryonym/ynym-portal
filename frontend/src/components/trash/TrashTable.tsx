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
  start_at?: string | null
  end_at?: string | null
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
      <div className="py-16 text-center text-muted-foreground">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mb-2" />
        <p className="text-sm">読み込み中...</p>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="py-14 text-center border border-border/80 rounded-xl bg-card">
        <Trash2 className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2.5" />
        <p className="text-sm font-medium text-foreground">ゴミ箱は空です</p>
      </div>
    )
  }
  // リソースに応じたアイテム情報の抽出
  const getItemDetails = (item: BaseTrashItem) => {
    switch (resourceType) {
      case 'events':
        return {
          icon: Calendar,
          name: item.title || '無題の予定',
          subInfo: item.description
            ? item.description.slice(0, 60) +
              (item.description.length > 60 ? '...' : '')
            : null,
          badge: item.start_at
            ? `日時: ${formatDisplayDateTime(item.start_at)}`
            : '予定',
        }
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
    <div className="border border-border/80 rounded-xl overflow-hidden bg-card shadow-2xs">
      <ul className="divide-y divide-border/60">
        {items.map((item) => {
          const details = getItemDetails(item)
          const Icon = details.icon
          const isRestoring = restoringId === item.id
          const isPurging = purgingId === item.id
          return (
            <li
              key={item.id}
              className="p-4 sm:px-5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2 rounded-lg bg-secondary text-secondary-foreground shrink-0 mt-0.5">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {details.name}
                    </h3>
                    {details.badge && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {details.badge}
                      </span>
                    )}
                  </div>
                  {details.subInfo && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {details.subInfo}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 mt-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>
                      削除:{' '}
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
                  className="cursor-pointer gap-1.5 text-xs"
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
                  className="cursor-pointer gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
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
