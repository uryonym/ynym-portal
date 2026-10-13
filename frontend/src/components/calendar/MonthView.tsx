import { useState } from 'react'

import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

import { EventChip } from '@/components/calendar/EventChip'
import { TaskChip } from '@/components/calendar/TaskChip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getEventsForDay, getMonthGrid, getTasksForDay } from '@/lib/calendar'

import type { CalendarEvent } from '@/lib/types/event'
import type { Task } from '@/lib/types/task'

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  tasks?: Task[]
  showTasks?: boolean
  onSelectEvent: (event: CalendarEvent) => void
  onSelectDay: (date: Date) => void
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export function MonthView({
  currentDate,
  events,
  tasks = [],
  showTasks = false,
  onSelectEvent,
  onSelectDay,
}: MonthViewProps) {
  const [overflowDate, setOverflowDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const days = getMonthGrid(year, month)

  const maxVisibleEvents = 3

  const overflowEvents = overflowDate
    ? getEventsForDay(events, overflowDate)
    : []
  const overflowTasks =
    overflowDate && showTasks ? getTasksForDay(tasks, overflowDate) : []

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold py-2">
        {WEEKDAYS.map((day, i) => {
          const isSunday = i === 0
          const isSaturday = i === 6
          return (
            <div
              key={day}
              className={`py-0.5 ${
                isSunday
                  ? 'text-rose-500 dark:text-rose-400'
                  : isSaturday
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-muted-foreground'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* カレンダーセルグリッド */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border bg-border/20">
        {days.map((day) => {
          const dayEvents = getEventsForDay(events, day.date)
          const dayTasks = showTasks ? getTasksForDay(tasks, day.date) : []
          const totalCount = dayEvents.length + dayTasks.length

          const visibleEvents = dayEvents.slice(0, maxVisibleEvents)
          const remainingSlots = Math.max(
            0,
            maxVisibleEvents - visibleEvents.length,
          )
          const visibleTasks = dayTasks.slice(0, remainingSlots)

          const hasMore = totalCount > maxVisibleEvents
          const moreCount = totalCount - maxVisibleEvents

          const isSunday = day.dayOfWeek === 0
          const isSaturday = day.dayOfWeek === 6

          return (
            <div
              key={day.dateKey}
              onClick={() => onSelectDay(day.date)}
              className={`group relative flex min-h-[95px] sm:min-h-[115px] flex-col p-1.5 transition cursor-pointer select-none ${
                day.isCurrentMonth
                  ? 'bg-card hover:bg-muted/30'
                  : 'bg-muted/10 text-muted-foreground/40 hover:bg-muted/20'
              }`}
            >
              {/* 日付ヘッダー */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    day.isToday
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : day.isCurrentMonth
                        ? isSunday
                          ? 'text-rose-500'
                          : isSaturday
                            ? 'text-sky-500'
                            : 'text-foreground'
                        : 'text-muted-foreground/40'
                  }`}
                >
                  {format(day.date, 'd')}
                </span>

                {/* スマホ等で件数のみ表示したい場合のヒント */}
                {totalCount > 0 && (
                  <span className="sm:hidden text-[10px] text-muted-foreground font-semibold">
                    {totalCount}件
                  </span>
                )}
              </div>

              {/* 予定およびタスク一覧 */}
              <div className="flex flex-col gap-1 overflow-hidden">
                {visibleEvents.map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    onClick={onSelectEvent}
                  />
                ))}

                {visibleTasks.map((task) => (
                  <TaskChip key={task.id} task={task} />
                ))}

                {/* 超過分の「+N件」ボタン */}
                {hasMore && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setOverflowDate(day.date)
                    }}
                    className="mt-0.5 rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition text-center"
                  >
                    他 {moreCount} 件
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 「+N件」クリック時の当日予定・タスクダイアログ */}
      <Dialog
        open={Boolean(overflowDate)}
        onOpenChange={(open) => !open && setOverflowDate(null)}
      >
        <DialogContent className="w-full max-w-sm mx-auto">
          <DialogHeader className="text-left">
            <DialogTitle>
              {overflowDate &&
                format(overflowDate, 'yyyy年M月d日(E) の予定・タスク', {
                  locale: ja,
                })}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto py-2">
            {overflowEvents.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  予定
                </span>
                <div className="flex flex-col gap-1">
                  {overflowEvents.map((event) => (
                    <EventChip
                      key={event.id}
                      event={event}
                      onClick={(e) => {
                        setOverflowDate(null)
                        onSelectEvent(e)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {overflowTasks.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  タスク期日
                </span>
                <div className="flex flex-col gap-1">
                  {overflowTasks.map((task) => (
                    <TaskChip key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
