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
      className={`group flex flex-col justify-between p-4 bg-card rounded-xl border shadow-2xs transition-colors cursor-pointer text-left ${
        note.is_pinned
          ? 'border-primary/40 bg-accent/25'
          : 'border-border/80 hover:border-primary/30 hover:bg-accent/15'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {note.is_pinned && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium bg-secondary text-secondary-foreground"
                title="ピン留め"
              >
                <Pin className="h-3 w-3 fill-primary text-primary" />
                <span className="hidden sm:inline">固定</span>
              </span>
            )}
            {category ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground/80 text-xs font-medium truncate max-w-[150px]">
                <Folder className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="truncate">{category.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground text-xs font-normal">
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
                    ? 'text-primary hover:text-primary hover:bg-secondary opacity-100'
                    : 'text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100'
                }`}
                title={note.is_pinned ? 'ピン留めを解除' : 'ピン留め'}
                aria-label={note.is_pinned ? 'ピン留めを解除' : 'ピン留め'}
              >
                <Pin
                  className={`h-3.5 w-3.5 ${
                    note.is_pinned ? 'fill-primary' : ''
                  }`}
                />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="編集"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="削除"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <h3 className="font-semibold text-foreground text-base line-clamp-1 mb-1">
          {note.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-all">
          {note.body}
        </p>
      </div>

      <div className="mt-4 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{formatDisplayDate(note.updated_at, 'M月d日 HH:mm')}</span>
      </div>
    </div>
  )
}
