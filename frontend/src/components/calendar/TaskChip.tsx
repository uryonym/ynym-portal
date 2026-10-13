import { CheckSquare, Square } from 'lucide-react'

import { useToggleTaskMutation } from '@/hooks/queries/useTasks'

import type { Task } from '@/lib/types/task'

interface TaskChipProps {
  task: Task
  className?: string
}

export function TaskChip({ task, className = '' }: TaskChipProps) {
  const toggleMutation = useToggleTaskMutation()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleMutation.mutate({ id: task.id, isCompleted: !task.is_completed })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group flex w-full items-center gap-1.5 overflow-hidden rounded border border-dashed border-border/90 bg-muted/40 px-1.5 py-0.5 text-left text-xs transition hover:bg-muted/80 ${
        task.is_completed ? 'opacity-60' : ''
      } ${className}`}
      title={`[タスク期日] ${task.title}${task.is_completed ? '（完了済み）' : ''}`}
    >
      {task.is_completed ? (
        <CheckSquare className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Square className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground" />
      )}
      <span
        className={`truncate font-medium ${
          task.is_completed
            ? 'line-through text-muted-foreground'
            : 'text-foreground'
        }`}
      >
        {task.title}
      </span>
    </button>
  )
}
