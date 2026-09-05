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
    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <Checkbox
        checked={todo.is_completed}
        onCheckedChange={() => onToggleComplete(todo.id)}
        className="mt-1"
        aria-label="タスク完了状態"
      />

      <div className="flex-1 min-w-0">
        <h3
          className={`text-base font-medium wrap-break-word ${
            todo.is_completed ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {todo.title}
        </h3>

        {todo.description && (
          <p className="text-sm text-gray-600 mt-1 wrap-break-word">
            {todo.description}
          </p>
        )}

        {todo.due_date && (
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDisplayDate(todo.due_date, 'MM月dd日')}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(todo)}
          className="h-10 w-10 p-0"
          aria-label="編集"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
