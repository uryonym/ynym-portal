'use client'

import { Note } from '@/lib/types/note'
import { NoteCategory } from '@/lib/types/note-category'
import { Folder, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDisplayDate } from '@/lib/date'

interface NoteItemProps {
  note: Note
  category?: NoteCategory
  onView: (note: Note) => void
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}

export function NoteItem({
  note,
  category,
  onView,
  onEdit,
  onDelete,
}: NoteItemProps) {
  return (
    <div
      onClick={() => onView(note)}
      className="group flex flex-col justify-between p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer text-left"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {category ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium truncate max-w-[180px]">
              <Folder className="h-3 w-3 shrink-0" />
              <span className="truncate">{category.name}</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-xs font-medium border border-slate-100">
              未分類
            </span>
          )}

          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-slate-900 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="編集"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="削除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2 mb-1.5">
          {note.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap leading-relaxed">
          {note.body}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
        更新日: {formatDisplayDate(note.updated_at, 'yyyy年M月d日')}
      </div>
    </div>
  )
}
