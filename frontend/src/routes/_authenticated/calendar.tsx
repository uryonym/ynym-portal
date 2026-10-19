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

import { AgendaView } from '@/components/calendar/AgendaView'
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar'
import { EventDeleteDialog } from '@/components/calendar/EventDeleteDialog'
import { EventDetailDialog } from '@/components/calendar/EventDetailDialog'
import { EventDialog } from '@/components/calendar/EventDialog'
import { MemberFilter } from '@/components/calendar/MemberFilter'
import { MonthView } from '@/components/calendar/MonthView'
import { MyColorDialog } from '@/components/calendar/MyColorDialog'
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventsQuery,
  useUpdateEventMutation,
} from '@/hooks/queries/useEvents'
import { useTasksQuery } from '@/hooks/queries/useTasks'

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from '@/lib/types/event'

const calendarSearchSchema = z.object({
  view: z.enum(['month', 'agenda']).catch('month'),
  date: z.string().optional(),
  members: z.array(z.string()).optional(),
  showTasks: z.boolean().catch(true).optional(),
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
  const selectedMemberIds = search.members ?? []
  const showTasks = search.showTasks ?? true

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
    member_ids: selectedMemberIds.length > 0 ? selectedMemberIds : undefined,
  })

  // タスク取得クエリ（期日範囲で取得、showTasks が false の時はフェッチを無効化）
  const { data: tasks = [] } = useTasksQuery(
    {
      due_from: format(rangeStart, 'yyyy-MM-dd'),
      due_to: format(rangeEnd, 'yyyy-MM-dd'),
    },
    { enabled: showTasks },
  )

  // ミューテーション
  const createMutation = useCreateEventMutation()
  const updateMutation = useUpdateEventMutation()
  const deleteMutation = useDeleteEventMutation()

  // ダイアログ状態管理
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
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

  const handleToggleMember = (memberId: string) => {
    const next = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter((id) => id !== memberId)
      : [...selectedMemberIds, memberId]
    navigate({
      search: (prev) => ({
        ...prev,
        members: next.length > 0 ? next : undefined,
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

      {/* メンバー絞り込み & タスク表示トグルバー */}
      <MemberFilter
        selectedMemberIds={selectedMemberIds}
        onToggleMember={handleToggleMember}
        onClearFilter={() =>
          navigate({
            search: (prev) => ({
              ...prev,
              members: undefined,
            }),
          })
        }
        showTasks={showTasks}
        onToggleShowTasks={(val) =>
          navigate({
            search: (prev) => ({
              ...prev,
              showTasks: val,
            }),
          })
        }
        onOpenColorDialog={() => setIsColorDialogOpen(true)}
      />

      {/* ビュー切り替え */}
      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          events={events}
          tasks={tasks}
          showTasks={showTasks}
          onSelectEvent={handleSelectEvent}
          onSelectDay={handleSelectDay}
        />
      ) : (
        <AgendaView
          currentDate={currentDate}
          events={events}
          tasks={tasks}
          showTasks={showTasks}
          onSelectEvent={handleSelectEvent}
          onSelectDay={handleSelectDay}
        />
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

      {/* マイカラー変更ダイアログ */}
      <MyColorDialog
        open={isColorDialogOpen}
        onOpenChange={setIsColorDialogOpen}
      />
    </div>
  )
}
