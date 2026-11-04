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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          タスク
        </h1>
        <Button
          onClick={onAddNew}
          className="h-9 px-3.5 gap-1.5 rounded-lg cursor-pointer text-xs sm:text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>追加</span>
        </Button>
      </div>

      {/* フィルタータブ */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-border">
        {tabs.map(({ key, label }) => {
          const isSelected = filter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              disabled={isLoading}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'border-primary text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <span>{label}</span>
              {isSelected && tasks.length > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-secondary text-secondary-foreground font-medium leading-normal">
                  {tasks.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* タスク一覧 */}
      <div>
        {isLoading ? (
          <div className="flex justify-center py-20 bg-card rounded-xl border border-border/80">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 bg-card rounded-xl border border-border/80 text-center">
            {filter === 'completed' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  完了したタスクはありません
                </p>
              </>
            ) : filter === 'active' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  進行中のタスクはありません
                </p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-3">
                  <ListTodo className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  タスクはありません
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/80 shadow-2xs divide-y divide-border/60 overflow-hidden">
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
