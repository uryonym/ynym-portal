'use client'
import type { Task } from '@/lib/types/task'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Pencil, Calendar } from 'lucide-react'
import { formatDisplayDate } from '@/lib/date'

export interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
}
export function TaskItem({ task, onToggleComplete, onEdit }: TaskItemProps) {
  return (
    <div className="group flex items-start gap-3.5 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="mt-0.5"
        aria-label="タスク完了状態"
      />

      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm sm:text-base font-medium wrap-break-word leading-snug transition-colors ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-900'}`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 wrap-break-word leading-relaxed">
            {task.description}
          </p>
        )}

        {task.due_date && (
          <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md bg-slate-50 text-xs text-slate-500 border border-slate-100">
            <Calendar className="h-3 w-3" />
            <span>{formatDisplayDate(task.due_date, 'MM月dd日')}</span>
          </div>
        )}
      </div>

      <div className="shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="編集"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
