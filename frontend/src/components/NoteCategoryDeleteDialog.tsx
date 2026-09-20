import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  const handleDelete = () => {
    onConfirm(category.id)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>カテゴリを削除</DialogTitle>
          <DialogDescription className="text-slate-500 pt-2">
            カテゴリ「
            <span className="font-semibold text-slate-800">
              {category.name}
            </span>
            」を削除してもよろしいですか？
            <br />
            この操作は取り消せません。なお、ノートが紐付いているカテゴリは削除できません。
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
