import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog'

import type { NoteCategory } from '@/lib/types/note-category'

interface NoteCategoryDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: NoteCategory | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}

export function NoteCategoryDeleteDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading = false,
}: NoteCategoryDeleteDialogProps) {
  if (!category) return null

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="カテゴリを削除"
      description={
        <>
          カテゴリ「
          <span className="font-semibold text-slate-800">{category.name}</span>
          」を削除してもよろしいですか？
          <br />
          削除したカテゴリはゴミ箱から復元できます。なお、ノートが紐付いているカテゴリは削除できません。
        </>
      }
      onConfirm={() => onConfirm(category.id)}
      isLoading={isLoading}
    />
  )
}
