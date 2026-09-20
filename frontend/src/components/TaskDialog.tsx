'use client'
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
  const title = initialData ? 'タスクを編集' : '新しいタスクを作成'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <TaskForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
