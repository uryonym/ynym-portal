import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PurgeConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  isBatch?: boolean
  onConfirm: () => void
  isLoading?: boolean
}

export function PurgeConfirmDialog({
  open,
  onOpenChange,
  title = '完全削除の確認',
  description,
  itemName,
  isBatch = false,
  onConfirm,
  isLoading = false,
}: PurgeConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-destructive">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2 space-y-2">
            {description ? (
              <span>{description}</span>
            ) : isBatch ? (
              <span>
                表示中のタブの項目をすべて完全に削除します。
                <br />
                <strong className="text-destructive">
                  完全削除したデータは元に戻せません。
                </strong>
              </span>
            ) : (
              <span>
                「<strong className="text-foreground">{itemName}</strong>
                」を完全に削除します。
                <br />
                <strong className="text-destructive">
                  完全削除したデータは元に戻せません。
                </strong>
              </span>
            )}
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
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? '削除中...' : '完全削除する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
