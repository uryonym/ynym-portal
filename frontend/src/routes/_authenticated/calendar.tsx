import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { z } from 'zod'

import { CalendarToolbar } from '@/components/calendar/CalendarToolbar'
import { EventDeleteDialog } from '@/components/calendar/EventDeleteDialog'
import { EventDetailDialog } from '@/components/calendar/EventDetailDialog'
import { EventDialog } from '@/components/calendar/EventDialog'
import { MonthView } from '@/components/calendar/MonthView'
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventsQuery,
  useUpdateEventMutation,
} from '@/hooks/queries/useEvents'

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from '@/lib/types/event'

const calendarSearchSchema = z.object({
  view: z.enum(['month', 'agenda']).catch('month'),
  date: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/calendar')({
  validateSearch: (search) => calendarSearchSchema.parse(search),
  component: CalendarPage,
})

function CalendarPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  // 現在表示中の日付（基準日）
  const currentDate = search.date ? parseISO(search.date) : new Date()
  const view = search.view

  // カレンダーグリッドの表示期間を計算（前後の週を含む）
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const rangeStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const startParam = `${format(rangeStart, 'yyyy-MM-dd')}T00:00:00+09:00`
  const endParam = `${format(addDays(rangeEnd, 1), 'yyyy-MM-dd')}T00:00:00+09:00`

  // イベント取得クエリ
  const { data: events = [] } = useEventsQuery({
    start: startParam,
    end: endParam,
  })

  // ミューテーション
  const createMutation = useCreateEventMutation()
  const updateMutation = useUpdateEventMutation()
  const deleteMutation = useDeleteEventMutation()

  // ダイアログ状態管理
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createInitialDate, setCreateInitialDate] = useState<Date | undefined>(
    undefined,
  )

  // ナビゲーション処理
  const setDate = (newDate: Date) => {
    navigate({
      search: (prev) => ({
        ...prev,
        date: format(newDate, 'yyyy-MM-dd'),
      }),
    })
  }

  const handlePrevMonth = () => setDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setDate(addMonths(currentDate, 1))
  const handleToday = () => setDate(new Date())

  const handleViewChange = (newView: 'month' | 'agenda') => {
    navigate({
      search: (prev) => ({
        ...prev,
        view: newView,
      }),
    })
  }

  // イベント操作
  const handleSelectDay = (date: Date) => {
    setCreateInitialDate(date)
    setEditingEvent(null)
    setIsCreateOpen(true)
  }

  const handleNewEvent = () => {
    setCreateInitialDate(currentDate)
    setEditingEvent(null)
    setIsCreateOpen(true)
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setDetailEvent(event)
  }

  const handleOpenEdit = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsCreateOpen(true)
  }

  const handleSubmitEvent = (data: CreateEventInput | UpdateEventInput) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, input: data })
    } else {
      createMutation.mutate(data as CreateEventInput)
    }
  }

  const handleConfirmDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeletingEvent(null)
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full pb-8">
      {/* ツールバー */}
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        onViewChange={handleViewChange}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onNewEvent={handleNewEvent}
      />

      {/* ビュー切り替え */}
      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectDay={handleSelectDay}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p className="text-sm">
            リスト表示（アジェンダ表示）は Step 3 にて対応予定です。
          </p>
        </div>
      )}

      {/* 予定詳細ダイアログ */}
      <EventDetailDialog
        open={Boolean(detailEvent)}
        onOpenChange={(open) => !open && setDetailEvent(null)}
        event={detailEvent}
        onEdit={(event) => {
          setDetailEvent(null)
          handleOpenEdit(event)
        }}
        onDelete={(event) => {
          setDetailEvent(null)
          setDeletingEvent(event)
        }}
      />

      {/* 予定作成・編集ダイアログ */}
      <EventDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialDate={createInitialDate}
        initialEvent={editingEvent}
        onSubmit={handleSubmitEvent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* 予定削除確認ダイアログ */}
      <EventDeleteDialog
        open={Boolean(deletingEvent)}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        event={deletingEvent}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
