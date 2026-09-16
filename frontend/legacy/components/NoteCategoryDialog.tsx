'use client'

import { NoteCategory } from '@/lib/types/note-category'
import { NoteCategoryFormValues } from '@/lib/validations/note-category'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NoteCategoryForm } from './NoteCategoryForm'

interface NoteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: NoteCategory | null
  onSubmit: (data: NoteCategoryFormValues) => void
  onDelete?: (category: NoteCategory) => void
  isLoading?: boolean
}

export function NoteCategoryDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  onDelete,
  isLoading = false,
}: NoteCategoryDialogProps) {
  const title = initialData ? 'カテゴリを編集' : '新しいカテゴリを作成'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <NoteCategoryForm
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
