import { Plus, CheckCircle2, ListTodo } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { TaskItem } from './TaskItem'

import type { TaskFilter } from '@/lib/api/tasks'
import type { Task } from '@/lib/types/task'

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
  const tabs = [
    { key: 'active', label: '進行中' },
    { key: 'completed', label: '完了' },
    { key: 'all', label: 'すべて' },
  ] as const

  return (
    <div className="space-y-5">
      {/* ページヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-normal text-slate-900">
            タスク
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 tracking-wide">
            日々のやることを管理します
          </p>
        </div>
        <Button
          onClick={onAddNew}
          className="h-9 px-3.5 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-2xs cursor-pointer text-xs sm:text-sm font-medium tracking-wide transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>タスクを追加</span>
        </Button>
      </div>

      {/* フラットフィルタータブ */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200/80">
        {tabs.map(({ key, label }) => {
          const isSelected = filter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              disabled={isLoading}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-medium tracking-wide transition-colors border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{label}</span>
              {isSelected && tasks.length > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-normal leading-normal">
                  {tasks.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* タスク一覧（フラットな仕切りリスト） */}
      <div>
        {isLoading ? (
          <div className="flex justify-center py-20 bg-white rounded-xl border border-slate-200/80">
            <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-slate-200/70 text-center">
            {filter === 'completed' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  完了したタスクはありません
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  進行中のタスクをチェックするとここに表示されます
                </p>
              </>
            ) : filter === 'active' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  進行中のタスクはありません
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  すべてのタスクが完了しています
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <ListTodo className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  タスクがまだありません
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  「タスクを追加」から新しいタスクを作成できます
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
