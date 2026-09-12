'use client'

import { TaskItem, type TaskItemProps } from './TaskItem'

/** @deprecated Use `TaskItemProps` instead. */
export type TodoItemProps = {
  todo: TaskItemProps['task']
  onToggleComplete: TaskItemProps['onToggleComplete']
  onEdit: TaskItemProps['onEdit']
}

/** @deprecated Use `TaskItem` instead. */
export function TodoItem({ todo, onToggleComplete, onEdit }: TodoItemProps) {
  return (
    <TaskItem task={todo} onToggleComplete={onToggleComplete} onEdit={onEdit} />
  )
}
