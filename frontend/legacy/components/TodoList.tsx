'use client'

import { TaskList, type TaskListProps } from './TaskList'

/** @deprecated Use `TaskListProps` instead. */
export type TodoListProps = {
  todos: TaskListProps['tasks']
  onToggleComplete: TaskListProps['onToggleComplete']
  onEdit: TaskListProps['onEdit']
  onAddNew: TaskListProps['onAddNew']
  filter: TaskListProps['filter']
  onFilterChange: TaskListProps['onFilterChange']
  isLoading?: TaskListProps['isLoading']
}

/** @deprecated Use `TaskList` instead. */
export function TodoList({
  todos,
  onToggleComplete,
  onEdit,
  onAddNew,
  filter,
  onFilterChange,
  isLoading,
}: TodoListProps) {
  return (
    <TaskList
      tasks={todos}
      onToggleComplete={onToggleComplete}
      onEdit={onEdit}
      onAddNew={onAddNew}
      filter={filter}
      onFilterChange={onFilterChange}
      isLoading={isLoading}
    />
  )
}
