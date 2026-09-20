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
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>ユーザーの論理削除（退会）</DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                対象: {user.name} ({user.email})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 text-sm text-slate-600 leading-relaxed space-y-2">
          <p>このユーザーを論理削除しますか？</p>
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800">
            論理削除されたユーザーは、次回以降 Google
            アカウントでのログインが拒否されます（退会扱いとなります）。
          </div>
        </div>

        <DialogFooter className="pt-2 flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-10 rounded-xl"
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? '削除中...' : '論理削除する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
