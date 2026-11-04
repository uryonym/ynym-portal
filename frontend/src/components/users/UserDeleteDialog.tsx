import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

import type { User } from '@/lib/types/user'

interface UserDeleteDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (userId: string) => Promise<boolean>
  isLoading?: boolean
}
export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: UserDeleteDialogProps) {
  if (!user) return null
  const handleConfirm = async () => {
    const success = await onConfirm(user.id)
    if (success) {
      onOpenChange(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>ユーザーの利用停止</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {user.name} ({user.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>
            このユーザーの利用を停止しますか？停止すると、次回以降ログインできなくなります（いつでも再開できます）。
          </p>
        </div>

        <DialogFooter className="pt-2 flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-9 rounded-lg"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-9 rounded-lg"
          >
            {isLoading ? '処理中...' : '利用を停止する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
