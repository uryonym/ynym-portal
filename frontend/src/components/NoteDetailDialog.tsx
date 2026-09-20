import { Folder, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDisplayDate } from '@/lib/date'

import type { Note } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'

interface NoteDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: Note | null
  category?: NoteCategory
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}
export function NoteDetailDialog({
  open,
  onOpenChange,
  note,
  category,
  onEdit,
  onDelete,
}: NoteDetailDialogProps) {
  if (!note) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl mx-auto max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            {category ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <Folder className="h-3 w-3 shrink-0" />
                <span>{category.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-xs font-medium border border-slate-100">
                未分類
              </span>
            )}
            <span className="text-xs text-slate-400">
              更新: {formatDisplayDate(note.updated_at, 'yyyy年M月d日 HH:mm')}
            </span>
          </div>

          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {note.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border-y border-slate-100 my-2 max-h-[50vh]">
          {note.body}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(note)
              }}
              className="gap-1.5 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>編集</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onDelete(note)
              }}
              className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>削除</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
