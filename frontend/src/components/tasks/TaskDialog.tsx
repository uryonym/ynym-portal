import {
  Dialog,
  DialogContent,
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
  const title = isEditing ? 'タスクを編集' : 'タスクを追加'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg mx-auto p-5 sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-semibold text-foreground tracking-tight">
            {title}
          </DialogTitle>
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
