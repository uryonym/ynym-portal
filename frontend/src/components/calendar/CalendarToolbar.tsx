import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  Plus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CalendarToolbarProps {
  currentDate: Date
  view: 'month' | 'agenda'
  onViewChange: (view: 'month' | 'agenda') => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onNewEvent: () => void
}

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onNewEvent,
}: CalendarToolbarProps) {
  const monthTitle = format(currentDate, 'yyyy年 M月', { locale: ja })

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-2">
      {/* 左側: 前後月移動・今日・年月 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPrevMonth}
            aria-label="前月へ"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs font-medium"
            onClick={onToday}
          >
            今日
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNextMonth}
            aria-label="次月へ"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground ml-2">
          {monthTitle}
        </h2>
      </div>

      {/* 右側: ビュー切替 & 新規作成ボタン */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <Button
            type="button"
            variant={view === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3 text-xs gap-1.5"
            onClick={() => onViewChange('month')}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>月</span>
          </Button>
          <Button
            type="button"
            variant={view === 'agenda' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3 text-xs gap-1.5"
            onClick={() => onViewChange('agenda')}
          >
            <List className="h-3.5 w-3.5" />
            <span>リスト</span>
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          className="h-8 gap-1.5"
          onClick={onNewEvent}
        >
          <Plus className="h-4 w-4" />
          <span>予定を追加</span>
        </Button>
      </div>
    </div>
  )
}
