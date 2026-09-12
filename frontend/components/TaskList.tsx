'use client'

import { Task } from '@/lib/types/task'
import { TaskFilter } from '@/lib/api/tasks'
import { TaskItem } from './TaskItem'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onEdit: (task: Task) => void
  onAddNew: () => void
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  isLoading?: boolean
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onAddNew,
  filter,
  onFilterChange,
  isLoading = false,
}: TaskListProps) {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            タスク
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            日々のやることを管理します
          </p>
        </div>
        <Button
          onClick={onAddNew}
          className="h-10 px-4 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>タスクを追加</span>
        </Button>
      </div>

      {/* フィルタタブ */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
        {(
          [
            { key: 'active', label: '進行中' },
            { key: 'completed', label: '完了' },
            { key: 'all', label: 'すべて' },
          ] as const
        ).map(({ key, label }) => {
          const isSelected = filter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              disabled={isLoading}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* タスクアイテムリスト */}
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
            <p className="text-sm text-slate-400">
              {filter === 'completed' && '完了したタスクはありません'}
              {filter === 'active' && '進行中のタスクはありません'}
              {filter === 'all' && 'タスクがまだありません'}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}
