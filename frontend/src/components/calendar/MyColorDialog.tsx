import { useState } from 'react'

import { Check, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuthUserQuery } from '@/hooks/queries/useAuth'
import { useUpdateMyColorMutation } from '@/hooks/queries/useMembers'
import { DEFAULT_MEMBER_COLORS, getMemberColor } from '@/lib/calendar'

interface MyColorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MyColorDialog({ open, onOpenChange }: MyColorDialogProps) {
  const { data: currentUser } = useAuthUserQuery()
  const updateMutation = useUpdateMyColorMutation()

  const currentColor = currentUser?.color ?? null
  const defaultAutoColor = getMemberColor(currentUser?.id, null)

  const [selectedColor, setSelectedColor] = useState<string | null>(
    currentColor,
  )

  const handleSave = () => {
    updateMutation.mutate(
      { color: selectedColor },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm mx-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span>マイカラー設定</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            カレンダーの予定であなたを示す表示色を設定します。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {DEFAULT_MEMBER_COLORS.map((color) => {
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`h-11 rounded-lg flex items-center justify-center transition shadow-xs hover:scale-105 ${
                    isSelected
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                      : ''
                  }`}
                  aria-label={`色 ${color}`}
                >
                  {isSelected && (
                    <Check className="h-5 w-5 text-white drop-shadow" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              自動割当色:{' '}
              <span
                className="inline-block w-2.5 h-2.5 rounded-full align-middle ml-1"
                style={{ backgroundColor: defaultAutoColor }}
              />
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setSelectedColor(null)}
            >
              初期色に戻す
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
