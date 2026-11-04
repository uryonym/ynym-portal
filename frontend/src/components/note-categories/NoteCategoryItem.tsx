import { Folder, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatDisplayDate } from '@/lib/date'

import type { NoteCategory } from '@/lib/types/note-category'

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
    <div className="group flex items-center justify-between p-4 bg-card rounded-xl border border-border/80 shadow-2xs hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
          <Folder className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight truncate">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDisplayDate(category.created_at, 'yyyy年M月d日')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="編集"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="削除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
