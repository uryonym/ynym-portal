import { format, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Clock,
  Lock,
  MapPin,
  Plus,
} from 'lucide-react'

import { TaskChip } from '@/components/calendar/TaskChip'
import { Button } from '@/components/ui/button'
import {
  formatEventTime,
  getEventColorInfo,
  getEventsForDay,
  getMonthGrid,
  getTasksForDay,
} from '@/lib/calendar'

import type { CalendarEvent } from '@/lib/types/event'
import type { Task } from '@/lib/types/task'

interface AgendaViewProps {
  currentDate: Date
  events: CalendarEvent[]
  tasks?: Task[]
  showTasks?: boolean
  onSelectEvent: (event: CalendarEvent) => void
  onSelectDay: (date: Date) => void
}

export function AgendaView({
  currentDate,
  events,
  tasks = [],
  showTasks = false,
  onSelectEvent,
  onSelectDay,
}: AgendaViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const days = getMonthGrid(year, month)

  // 当月に属する日付を対象とし、予定またはタスクが存在する日付を抽出
  const currentMonthDays = days.filter((d) => d.isCurrentMonth)

  const daysWithItems = currentMonthDays
    .map((day) => {
      const dayEvents = getEventsForDay(events, day.date)
      const dayTasks = showTasks ? getTasksForDay(tasks, day.date) : []
      return {
        ...day,
        events: dayEvents,
        tasks: dayTasks,
        totalCount: dayEvents.length + dayTasks.length,
      }
    })
    .filter((d) => d.totalCount > 0)

  if (daysWithItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <CalendarIcon className="h-6 w-6" />
        </div>
        <h3 className="text-base font-medium">この月の予定はありません</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          家族の予定やイベントを登録してみましょう。
        </p>
        <Button
          onClick={() => onSelectDay(new Date())}
          className="mt-4 gap-1.5"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          予定を追加
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {daysWithItems.map((day) => {
        const today = isToday(day.date)
        const dayOfWeek = day.date.getDay()
        const isSunday = dayOfWeek === 0
        const isSaturday = dayOfWeek === 6

        return (
          <div
            key={day.dateKey}
            className="rounded-xl border border-border bg-card shadow-xs overflow-hidden"
          >
            {/* 日付ヘッダー */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-bold ${
                    today
                      ? 'text-primary'
                      : isSunday
                        ? 'text-rose-500'
                        : isSaturday
                          ? 'text-sky-500'
                          : 'text-foreground'
                  }`}
                >
                  {format(day.date, 'M月d日 (E)', { locale: ja })}
                </span>
                {today && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    今日
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                onClick={() => onSelectDay(day.date)}
              >
                <Plus className="h-3.5 w-3.5" />
                予定を追加
              </Button>
            </div>

            {/* イベント & タスク一覧 */}
            <div className="divide-y divide-border/60">
              {day.events.map((event) => {
                const colorInfo = getEventColorInfo(event)
                const timeText = formatEventTime(event)

                return (
                  <div
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className="flex cursor-pointer items-start gap-3 p-3.5 transition hover:bg-muted/40"
                  >
                    {/* カラーバー */}
                    <div
                      className="mt-0.5 h-10 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: colorInfo.border }}
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {event.title}
                        </span>
                        {event.is_private && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            <Lock className="h-2.5 w-2.5" />
                            自分のみ
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          {timeText}
                        </span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {event.location}
                            </span>
                          </span>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-2 pt-0.5">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* 参加者アバター */}
                    {event.participants.length > 0 && (
                      <div className="flex -space-x-1.5 shrink-0 self-center">
                        {event.participants.map((p) => (
                          <div
                            key={p.id}
                            className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-muted text-[10px] font-medium text-foreground ring-1 ring-border"
                            title={p.name}
                          >
                            {p.avatar_url ? (
                              <img
                                src={p.avatar_url}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              p.name.slice(0, 1)
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* タスク一覧 */}
              {day.tasks.map((task) => (
                <div key={task.id} className="p-2.5 bg-muted/20">
                  <TaskChip task={task} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
