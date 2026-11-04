import { useMemo } from 'react'

import { Pin, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { NoteFilter } from './NoteFilter'
import { NoteItem } from './NoteItem'

import type { Note, NoteCategoryFilter } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'

interface NoteListProps {
  notes: Note[]
  categories: NoteCategory[]
  selectedFilter: NoteCategoryFilter
  onFilterChange: (filter: NoteCategoryFilter) => void
  onView: (note: Note) => void
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
  onAddNew: () => void
  onTogglePin?: (note: Note) => void
  isLoading?: boolean
}

export function NoteList({
  notes,
  categories,
  selectedFilter,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  onTogglePin,
  isLoading = false,
}: NoteListProps) {
  const categoryMap = useMemo(() => {
    const map = new Map<string, NoteCategory>()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const { pinnedNotes, otherNotes } = useMemo(() => {
    const pinned: Note[] = []
    const others: Note[] = []
    notes.forEach((n) => {
      if (n.is_pinned) {
        pinned.push(n)
      } else {
        others.push(n)
      }
    })
    return { pinnedNotes: pinned, otherNotes: others }
  }, [notes])

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          ノート
        </h1>
        <Button
          onClick={onAddNew}
          className="h-9 px-3.5 gap-1.5 rounded-lg cursor-pointer text-xs sm:text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>ノートを書く</span>
        </Button>
      </div>

      {/* カテゴリ別フィルター */}
      <NoteFilter
        categories={categories}
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
        disabled={isLoading}
      />

      {/* ノートアイテム一覧 */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-14 bg-card rounded-xl border border-border/80 p-8 space-y-3">
          <p className="text-sm text-muted-foreground">
            {selectedFilter === 'all'
              ? 'まだノートがありません'
              : '該当するノートがありません'}
          </p>
          {selectedFilter === 'all' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddNew}
              className="cursor-pointer rounded-lg"
            >
              ノートを書く
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* ピン留めセクション */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Pin className="h-3.5 w-3.5 fill-primary text-primary" />
                <span>ピン留め</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {pinnedNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    category={
                      note.category_id
                        ? categoryMap.get(note.category_id)
                        : undefined
                    }
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* その他のノートセクション */}
          {otherNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <div className="text-xs font-medium text-muted-foreground">
                  すべて
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {otherNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    category={
                      note.category_id
                        ? categoryMap.get(note.category_id)
                        : undefined
                    }
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
