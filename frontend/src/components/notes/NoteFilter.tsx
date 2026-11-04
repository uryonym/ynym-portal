import { Folder } from 'lucide-react'

import type { NoteCategoryFilter } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'

interface NoteFilterProps {
  categories: NoteCategory[]
  selectedFilter: NoteCategoryFilter
  onFilterChange: (filter: NoteCategoryFilter) => void
  disabled?: boolean
}
export function NoteFilter({
  categories,
  selectedFilter,
  onFilterChange,
  disabled = false,
}: NoteFilterProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        onClick={() => onFilterChange('all')}
        disabled={disabled}
        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
          selectedFilter === 'all'
            ? 'bg-secondary text-secondary-foreground font-semibold'
            : 'bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/80'
        }`}
      >
        すべて
      </button>

      <button
        type="button"
        onClick={() => onFilterChange('uncategorized')}
        disabled={disabled}
        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
          selectedFilter === 'uncategorized'
            ? 'bg-secondary text-secondary-foreground font-semibold'
            : 'bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/80'
        }`}
      >
        未分類
      </button>

      {categories.map((category) => {
        const isSelected = selectedFilter === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onFilterChange(category.id)}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
              isSelected
                ? 'bg-secondary text-secondary-foreground font-semibold'
                : 'bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-border/80'
            }`}
          >
            <Folder className="h-3.5 w-3.5 shrink-0" />
            <span>{category.name}</span>
          </button>
        )
      })}
    </div>
  )
}
