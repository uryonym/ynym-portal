'use client'

import { Todo } from '@/lib/types/todo'
import { TaskFilter } from '@/lib/api/todos'
import { TodoItem } from './TodoItem'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface TodoListProps {
  todos: Todo[]
  onToggleComplete: (id: string) => void
  onEdit: (todo: Todo) => void
  onAddNew: () => void
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  isLoading?: boolean
}

export function TodoList({
  todos,
  onToggleComplete,
  onEdit,
  onAddNew,
  filter,
  onFilterChange,
  isLoading = false,
}: TodoListProps) {
  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">タスク一覧</h1>
        <Button onClick={onAddNew} className="h-10 gap-2 w-full sm:w-auto">
          <Plus className="h-5 w-5" />
          新規タスク
        </Button>
      </div>

      {/* フィルタボタン */}
      <div className="flex gap-2 flex-wrap">
        {(['active', 'completed', 'all'] as const).map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filterType)}
            className="h-9"
            disabled={isLoading}
          >
            {filterType === 'all' && 'すべて'}
            {filterType === 'active' && '進行中'}
            {filterType === 'completed' && '完了'}
          </Button>
        ))}
      </div>

      {/* Todoアイテムリスト */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === 'completed' && 'まだ完了したタスクがありません'}
              {filter === 'active' && 'すべてのタスクが完了しました！'}
              {filter === 'all' && 'タスクがありません。新規作成してください'}
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}
