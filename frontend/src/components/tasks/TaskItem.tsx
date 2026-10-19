import React from 'react'

import { differenceInCalendarDays } from 'date-fns'
import { Pencil, Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDisplayDate } from '@/lib/date'

import type { Task } from '@/lib/types/task'

export interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
}

function getDueDateBadge(
  dueDateStr: string | null | undefined,
  isCompleted: boolean,
) {
  if (!dueDateStr) return null

  const date = new Date(dueDateStr)
  if (isNaN(date.getTime())) return null

  const diffDays = differenceInCalendarDays(date, new Date())

  if (isCompleted) {
    return {
      label: formatDisplayDate(date, 'M月d日'),
      className: 'text-slate-400 bg-slate-50 border-slate-200/50',
      iconColor: 'text-slate-300',
    }
  }

  if (diffDays < 0) {
    return {
      label: `${formatDisplayDate(date, 'M月d日')} (期限切れ)`,
      className: 'text-rose-600 bg-rose-50/80 border-rose-200/60 font-medium',
      iconColor: 'text-rose-500',
    }
  }
  if (diffDays === 0) {
    return {
      label: '今日',
      className:
        'text-amber-700 bg-amber-50/90 border-amber-200/70 font-medium',
      iconColor: 'text-amber-600',
    }
  }
  if (diffDays === 1) {
    return {
      label: '明日',
      className: 'text-blue-700 bg-blue-50/80 border-blue-200/60 font-medium',
      iconColor: 'text-blue-500',
    }
  }

  return {
    label: formatDisplayDate(date, 'M月d日(E)'),
    className: 'text-slate-600 bg-slate-50/80 border-slate-200/60',
    iconColor: 'text-slate-400',
  }
}

export function TaskItem({ task, onToggleComplete, onEdit }: TaskItemProps) {
  const badge = getDueDateBadge(task.due_date, task.is_completed)

  const handleRowClick = () => {
    onEdit(task)
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target === e.currentTarget) {
            handleRowClick()
          }
        }
      }}
      className={`group relative flex items-start gap-3.5 px-4 py-3 sm:px-5 sm:py-3.5 transition-colors cursor-pointer select-none ${
        task.is_completed
          ? 'bg-slate-50/40 hover:bg-slate-50/80 text-slate-400'
          : 'bg-white hover:bg-slate-50/70 text-slate-800'
      }`}
    >
      {/* チェックボックス */}
      <div
        className="shrink-0 pt-0.5"
        onClick={handleCheckboxClick}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={task.is_completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="cursor-pointer"
          aria-label="タスク完了状態"
        />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
          <span
            className={`text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-wide wrap-break-word ${
              task.is_completed
                ? 'line-through text-slate-400 font-normal'
                : 'text-slate-900 group-hover:text-slate-950'
            }`}
          >
            {task.title}
          </span>

          {/* 期日バッジ（デスクトップではタイトル右側にインライン配置） */}
          {badge && (
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs border shrink-0 sm:self-center transition-colors tracking-wide ${badge.className}`}
            >
              <Calendar className={`h-3 w-3 shrink-0 ${badge.iconColor}`} />
              <span className="leading-none">{badge.label}</span>
            </div>
          )}
        </div>

        {/* 説明文・メモ */}
        {task.description && (
          <p
            className={`text-xs sm:text-[13px] mt-1 whitespace-pre-wrap leading-relaxed tracking-wide line-clamp-2 ${
              task.is_completed ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* 編集アクションボタン */}
      <div className="shrink-0 self-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEditClick}
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
          aria-label="タスクを編集"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
