import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
  subDays,
} from 'date-fns'

import type { CalendarEvent } from '@/lib/types/event'

export const DEFAULT_MEMBER_COLORS = [
  '#3b82f6', // blue
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#14b8a6', // teal
]

export const SHARED_FAMILY_COLOR = '#6366f1' // indigo

/**
 * メンバーの表示色を決定論的に取得（未設定時はIDからハッシュ割当）
 */
export function getMemberColor(id?: string, color?: string | null): string {
  if (color) return color
  if (!id) return '#6b7280'
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % DEFAULT_MEMBER_COLORS.length
  return DEFAULT_MEMBER_COLORS[index]
}

/**
 * 予定のバッジ・バー表示色を決定
 * - 参加者が1人の場合: そのメンバーの色
 * - 参加者が複数人、または0人（家族全員）: 共通色
 */
export function getEventColor(event: CalendarEvent): string {
  if (event.participants.length === 1) {
    const p = event.participants[0]
    return getMemberColor(p.id, p.color)
  }
  return SHARED_FAMILY_COLOR
}

export interface CalendarDay {
  date: Date
  dateKey: string // YYYY-MM-DD
  isCurrentMonth: boolean
  isToday: boolean
  dayOfWeek: number // 0 = 日曜, 6 = 土曜
}

/**
 * 指定年月を含むカレンダー月グリッドの日付リストを生成（日曜日始まり）
 */
export function getMonthGrid(year: number, month: number): CalendarDay[] {
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = endOfMonth(monthStart)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const today = new Date()

  return days.map((date) => ({
    date,
    dateKey: format(date, 'yyyy-MM-dd'),
    isCurrentMonth: isSameMonth(date, monthStart),
    isToday: isSameDay(date, today),
    dayOfWeek: date.getDay(),
  }))
}

/**
 * 終日予定の表示用終了日を取得（終日は翌日0:00が排他的境界のため前日を包含表記）
 */
export function getEventDisplayEndDate(event: CalendarEvent): Date {
  const end = new Date(event.end_at)
  if (event.is_all_day) {
    return subDays(end, 1)
  }
  return end
}

/**
 * 複数日予定かどうかの判定
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
  const start = new Date(event.start_at)
  const displayEnd = getEventDisplayEndDate(event)
  return !isSameDay(start, displayEnd)
}

/**
 * 指定日の予定一覧を取得し、ソートして返す
 * ソート順: 終日・複数日予定 -> 開始時刻昇順
 */
export function getEventsForDay(
  events: CalendarEvent[],
  date: Date,
): CalendarEvent[] {
  const dayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
  )
  const dayEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  )

  const dayEvents = events.filter((e) => {
    const eStart = new Date(e.start_at)
    const eEnd = new Date(e.end_at)
    return eStart <= dayEnd && eEnd > dayStart
  })

  return dayEvents.sort((a, b) => {
    const aAllDay = a.is_all_day || isMultiDayEvent(a)
    const bAllDay = b.is_all_day || isMultiDayEvent(b)
    if (aAllDay && !bAllDay) return -1
    if (!aAllDay && bAllDay) return 1
    return new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  })
}
