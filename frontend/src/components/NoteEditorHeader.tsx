import { Link } from '@tanstack/react-router'
import { ArrowLeft, Check, Cloud, Loader2, Trash2 } from 'lucide-react'

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
  onSave,
  onDelete,
  isDeleting = false,
}: NoteEditorHeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs px-4 py-3 sticky top-0 z-20">
      {/* Left: Back Link & Category */}
      <div className="flex items-center gap-3">
        <Link
          to="/notes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100"
          title="ノート一覧に戻る"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">一覧へ</span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-200" />

        <div className="w-36 sm:w-44">
          <Select
            value={categoryId || NONE_CATEGORY_VALUE}
            onValueChange={(val) =>
              onCategoryChange(!val || val === NONE_CATEGORY_VALUE ? '' : val)
            }
          >
            <SelectTrigger className="h-8 text-xs border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
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
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
              <span>保存中...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-slate-600">
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
            className="h-8 px-2 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            title="ノートを削除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
