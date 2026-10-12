import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { CalendarEvent } from '@/lib/types/event'

interface EventDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: CalendarEvent | null
  onConfirm: (id: string) => void
  isLoading?: boolean
}

export function EventDeleteDialog({
  open,
  onOpenChange,
  event,
  onConfirm,
  isLoading = false,
}: EventDeleteDialogProps) {
  if (!event) return null

  const handleDelete = () => {
    onConfirm(event.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>予定を削除</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            予定「
            <span className="font-semibold text-foreground">{event.title}</span>
            」をゴミ箱に移動してもよろしいですか？
            <br />
            削除した予定はゴミ箱からいつでも復元できます。
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? '削除中...' : 'ゴミ箱へ移動'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
