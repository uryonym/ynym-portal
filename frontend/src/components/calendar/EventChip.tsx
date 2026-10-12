import { format } from 'date-fns'
import { Lock } from 'lucide-react'

import { getEventColor, isMultiDayEvent } from '@/lib/calendar'

import type { CalendarEvent } from '@/lib/types/event'

interface EventChipProps {
  event: CalendarEvent
  onClick?: (event: CalendarEvent) => void
  className?: string
}

export function EventChip({ event, onClick, className = '' }: EventChipProps) {
  const isAllDayOrMulti = event.is_all_day || isMultiDayEvent(event)
  const color = getEventColor(event)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(event)
  }

  if (isAllDayOrMulti) {
    return (
      <button
        type="button"
        onClick={handleClick}
        style={{
          backgroundColor: `${color}20`,
          borderColor: color,
          color: color,
        }}
        className={`group flex w-full items-center gap-1 overflow-hidden rounded border px-1.5 py-0.5 text-left text-xs font-medium transition hover:brightness-95 ${className}`}
        title={`${event.title}${event.is_private ? ' (プライベート)' : ''}`}
      >
        {event.is_private && (
          <Lock className="h-3 w-3 shrink-0 text-amber-500" />
        )}
        <span className="truncate">{event.title}</span>
      </button>
    )
  }

  const startTimeStr = format(new Date(event.start_at), 'HH:mm')

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex w-full items-center gap-1.5 overflow-hidden rounded px-1.5 py-0.5 text-left text-xs text-foreground transition hover:bg-muted/80 ${className}`}
      title={`${startTimeStr} ${event.title}${event.is_private ? ' (プライベート)' : ''}`}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {event.is_private && <Lock className="h-3 w-3 shrink-0 text-amber-500" />}
      <span className="shrink-0 text-[11px] text-muted-foreground">
        {startTimeStr}
      </span>
      <span className="truncate font-medium">{event.title}</span>
    </button>
  )
}
