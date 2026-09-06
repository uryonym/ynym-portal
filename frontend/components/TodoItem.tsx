'use client'

import { Todo } from '@/lib/types/todo'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Pencil, Calendar } from 'lucide-react'
import { formatDisplayDate } from '@/lib/date'

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: string) => void
  onEdit: (todo: Todo) => void
}

export function TodoItem({ todo, onToggleComplete, onEdit }: TodoItemProps) {
  return (
    <div className="group flex items-start gap-3.5 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <Checkbox
        checked={todo.is_completed}
        onCheckedChange={() => onToggleComplete(todo.id)}
        className="mt-0.5"
        aria-label="タスク完了状態"
      />

      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm sm:text-base font-medium wrap-break-word leading-snug transition-colors ${
            todo.is_completed ? 'line-through text-slate-400' : 'text-slate-900'
          }`}
        >
          {todo.title}
        </h3>

        {todo.description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1 wrap-break-word leading-relaxed">
            {todo.description}
          </p>
        )}

        {todo.due_date && (
          <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md bg-slate-50 text-xs text-slate-500 border border-slate-100">
            <Calendar className="h-3 w-3" />
            <span>{formatDisplayDate(todo.due_date, 'MM月dd日')}</span>
          </div>
        )}
      </div>

      <div className="shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(todo)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="編集"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
