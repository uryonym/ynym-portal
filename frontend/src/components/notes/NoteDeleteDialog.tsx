import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'

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

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="ノートを削除"
      description={
        <>
          ノート「
          <span className="font-semibold text-slate-800">{note.title}</span>
          」を削除してもよろしいですか？
          <br />
          削除したノートはゴミ箱からいつでも復元できます。
        </>
      }
      onConfirm={() => onConfirm(note.id)}
      isLoading={isLoading}
    />
  )
}
