'use client'

import { Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/types/todo'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TodoForm } from './TodoForm'

interface TodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Todo | null
  onSubmit: (data: CreateTodoInput | UpdateTodoInput) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function TodoDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  onDelete,
  isLoading = false,
}: TodoDialogProps) {
  const title = initialData ? 'タスクを編集' : '新しいタスクを作成'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <TodoForm
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
