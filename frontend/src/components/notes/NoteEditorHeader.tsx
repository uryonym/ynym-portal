import { Link } from '@tanstack/react-router'
import { ArrowLeft, Check, Cloud, Loader2, Pin, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { NoteCategory } from '@/lib/types/note-category'

interface NoteEditorHeaderProps {
  categoryId: string
  onCategoryChange: (categoryId: string) => void
  categories: NoteCategory[]
  saveStatus: 'saved' | 'saving' | 'unsaved'
  lastSavedAt?: Date | null
  isPinned?: boolean
  onTogglePin?: () => void
  onSave?: () => void
  onDelete?: () => void
  isDeleting?: boolean
}

const NONE_CATEGORY_VALUE = '__none__'

export function NoteEditorHeader({
  categoryId,
  onCategoryChange,
  categories,
  saveStatus,
  lastSavedAt,
  isPinned = false,
  onTogglePin,
  onSave,
  onDelete,
  isDeleting = false,
}: NoteEditorHeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-card/85 backdrop-blur-xs px-4 py-2.5 sticky top-0 z-20 rounded-t-xl">
      {/* Left: Back Link & Category */}
      <div className="flex items-center gap-3">
        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-muted"
          title="ノート一覧へ"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">一覧へ</span>
        </Link>

        <div className="h-4 w-[1px] bg-border" />

        <div className="w-36 sm:w-44">
          <Select
            value={categoryId || NONE_CATEGORY_VALUE}
            onValueChange={(val) =>
              onCategoryChange(!val || val === NONE_CATEGORY_VALUE ? '' : val)
            }
          >
            <SelectTrigger className="h-8 text-xs border-border bg-muted/40 hover:bg-muted/70 transition-colors">
              <SelectValue placeholder="カテゴリ選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_CATEGORY_VALUE} className="text-xs">
                未分類
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right: Save Status & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              <span>保存中...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">
                {lastSavedAt
                  ? `保存済み (${formatTime(lastSavedAt)})`
                  : '保存済み'}
              </span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <Cloud className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-amber-600">未保存</span>
            </>
          )}
        </div>

        {/* Pin Toggle Button */}
        {onTogglePin && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onTogglePin}
            className={`h-8 px-2 cursor-pointer transition-colors ${
              isPinned
                ? 'text-primary hover:text-primary bg-secondary hover:bg-secondary/80'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            title={isPinned ? 'ピン留めを解除' : 'ピン留め'}
          >
            <Pin className={`h-4 w-4 ${isPinned ? 'fill-primary' : ''}`} />
          </Button>
        )}

        {/* Manual Save Button */}
        {onSave && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            className="h-8 text-xs px-2.5 cursor-pointer"
          >
            保存
          </Button>
        )}

        {/* Delete Button */}
        {onDelete && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
            title="削除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
