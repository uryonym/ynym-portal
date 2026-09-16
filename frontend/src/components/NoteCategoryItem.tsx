'use client'

import { NoteCategory } from '@/lib/types/note-category'
import { Folder, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDisplayDate } from '@/lib/date'

interface NoteCategoryItemProps {
  category: NoteCategory
  onEdit: (category: NoteCategory) => void
  onDelete: (category: NoteCategory) => void
}

export function NoteCategoryItem({
  category,
  onEdit,
  onDelete,
}: NoteCategoryItemProps) {
  return (
    <div className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Folder className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight truncate">
            {category.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            登録日: {formatDisplayDate(category.created_at, 'yyyy年M月d日')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="編集"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="削除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
