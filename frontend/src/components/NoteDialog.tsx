'use client'
import type { Note } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'
import type { NoteFormValues } from '@/lib/validations/note'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NoteForm } from './NoteForm'

interface NoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Note | null
  categories: NoteCategory[]
  onSubmit: (data: NoteFormValues) => void
  onDelete?: (note: Note) => void
  isLoading?: boolean
}
export function NoteDialog({
  open,
  onOpenChange,
  initialData,
  categories,
  onSubmit,
  onDelete,
  isLoading = false,
}: NoteDialogProps) {
  const title = initialData ? 'ノートを編集' : '新しいノートを作成'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <NoteForm
          initialData={initialData}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
