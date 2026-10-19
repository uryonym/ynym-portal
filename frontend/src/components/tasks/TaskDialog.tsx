import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { TaskForm } from './TaskForm'

import type { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task'

export interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Task | null
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function TaskDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  onDelete,
  isLoading = false,
}: TaskDialogProps) {
  const isEditing = Boolean(initialData)
  const title = isEditing ? 'タスクを編集' : '新しいタスクを作成'
  const description = isEditing
    ? 'タスクの内容や期日を変更します'
    : 'やるべきことの概要や期日を設定します'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg mx-auto p-5 sm:p-6 rounded-2xl border-slate-200/80 shadow-lg">
        <DialogHeader className="pb-2 border-b border-slate-150">
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-[13px] text-slate-500 mt-1 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2">
          <TaskForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
