import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { Note } from '@/lib/types/note'

interface NoteDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: Note | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}
export function NoteDeleteDialog({
  open,
  onOpenChange,
  note,
  onConfirm,
  isLoading = false,
}: NoteDeleteDialogProps) {
  if (!note) return null
  const handleDelete = () => {
    onConfirm(note.id)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>ノートを削除</DialogTitle>
          <DialogDescription className="text-slate-500 pt-2">
            ノート「
            <span className="font-semibold text-slate-800">{note.title}</span>
            」を削除してもよろしいですか？
            <br />
            この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="cursor-pointer"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? '削除中...' : '削除する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
