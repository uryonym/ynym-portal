import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Clock, Lock, MapPin, Pencil, Trash2, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  getEventColor,
  getEventDisplayEndDate,
  getMemberColor,
  isMultiDayEvent,
} from '@/lib/calendar'

import type { CalendarEvent } from '@/lib/types/event'

interface EventDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
  onEdit: (event: CalendarEvent) => void
  onDelete: (event: CalendarEvent) => void
}

export function EventDetailDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
}: EventDetailDialogProps) {
  if (!event) return null

  const color = getEventColor(event)
  const isMultiDay = isMultiDayEvent(event)
  const startDate = new Date(event.start_at)
  const displayEndDate = getEventDisplayEndDate(event)

  const formatDateTimeRange = () => {
    if (event.is_all_day) {
      if (isMultiDay) {
        return `${format(startDate, 'yyyy年M月d日(E)', { locale: ja })} 〜 ${format(displayEndDate, 'M月d日(E)', { locale: ja })}（終日）`
      }
      return `${format(startDate, 'yyyy年M月d日(E)', { locale: ja })}（終日）`
    }

    if (isMultiDay) {
      return `${format(startDate, 'yyyy年M月d日(E) HH:mm', { locale: ja })} 〜 ${format(displayEndDate, 'M月d日(E) HH:mm', { locale: ja })}`
    }

    return `${format(startDate, 'yyyy年M月d日(E) HH:mm', { locale: ja })} 〜 ${format(new Date(event.end_at), 'HH:mm', { locale: ja })}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg mx-auto max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-3 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${color}15`,
                color: color,
                borderColor: `${color}40`,
                borderWidth: '1px',
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {event.participants.length === 0
                ? '家族全員'
                : event.participants.length === 1
                  ? event.participants[0].name
                  : `${event.participants.length}名`}
            </span>

            {event.is_private && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Lock className="h-3 w-3" />
                <span>プライベート（自分のみ）</span>
              </span>
            )}
          </div>

          <DialogTitle className="text-xl font-bold text-foreground leading-snug">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm text-foreground/80 border-y border-border my-2">
          {/* 日時 */}
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="font-medium text-foreground">
              {formatDateTimeRange()}
            </div>
          </div>

          {/* 場所 */}
          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>{event.location}</div>
            </div>
          )}

          {/* 参加者 */}
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-1.5 flex-wrap">
              {event.participants.length === 0 ? (
                <span className="text-muted-foreground">家族全員の予定</span>
              ) : (
                event.participants.map((p) => {
                  const pColor = getMemberColor(p.id, p.color)
                  return (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${pColor}15`,
                        color: pColor,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: pColor }}
                      />
                      {p.name}
                    </span>
                  )
                })
              )}
            </div>
          </div>

          {/* メモ */}
          {event.description && (
            <div className="pt-2 border-t border-border/50">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                メモ
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {event.description}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onDelete(event)
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            削除
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              閉じる
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(event)
              }}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              編集
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
