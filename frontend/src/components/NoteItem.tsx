import { Folder, Pencil, Pin, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatDisplayDate } from '@/lib/date'

import type { Note } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'

interface NoteItemProps {
  note: Note
  category?: NoteCategory
  onView: (note: Note) => void
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
  onTogglePin?: (note: Note) => void
}

export function NoteItem({
  note,
  category,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteItemProps) {
  return (
    <div
      onClick={() => onView(note)}
      className={`group flex flex-col justify-between p-4 bg-white rounded-xl border shadow-xs hover:shadow-sm transition-all cursor-pointer text-left ${
        note.is_pinned
          ? 'border-amber-200/90 bg-amber-50/15 ring-1 ring-amber-200/50'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {note.is_pinned && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800"
                title="ピン留めされたノート"
              >
                <Pin className="h-3 w-3 fill-amber-700 text-amber-700" />
                <span className="hidden sm:inline">固定</span>
              </span>
            )}
            {category ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium truncate max-w-[150px]">
                <Folder className="h-3 w-3 shrink-0" />
                <span className="truncate">{category.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-xs font-medium border border-slate-100">
                未分類
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {onTogglePin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePin(note)}
                className={`h-7 w-7 p-0 transition-opacity cursor-pointer ${
                  note.is_pinned
                    ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-100/60 opacity-100'
                    : 'text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100'
                }`}
                title={note.is_pinned ? 'ピン留めを解除' : 'ピン留めする'}
                aria-label={note.is_pinned ? 'ピン留めを解除' : 'ピン留めする'}
              >
                <Pin
                  className={`h-3.5 w-3.5 ${
                    note.is_pinned ? 'fill-amber-600' : ''
                  }`}
                />
              </Button>
            )}
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

        <h3 className="font-semibold text-slate-900 text-base line-clamp-1 mb-1">
          {note.title}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed break-all">
          {note.body}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>更新: {formatDisplayDate(note.updated_at, 'M月d日 HH:mm')}</span>
      </div>
    </div>
  )
}
