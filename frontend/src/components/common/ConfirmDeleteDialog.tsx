import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  itemName?: string | null
  description?: React.ReactNode
  confirmLabel?: string
  confirmVariant?: 'destructive' | 'default'
  onConfirm: () => void | Promise<unknown>
  isLoading?: boolean
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  itemName,
  description,
  confirmLabel = '削除',
  confirmVariant = 'destructive',
  onConfirm,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-slate-500 pt-2 text-sm leading-relaxed">
            {description ? (
              description
            ) : (
              <>
                {itemName && (
                  <>
                    「
                    <span className="font-semibold text-slate-800">
                      {itemName}
                    </span>
                    」を
                  </>
                )}
                削除してもよろしいですか？
                <br />
                削除したアイテムはゴミ箱からいつでも復元できます。
              </>
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
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? '処理中...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
