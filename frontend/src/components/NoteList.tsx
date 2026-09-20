'use client'
import { useMemo } from 'react'
import type { Note, NoteCategoryFilter } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { NoteItem } from './NoteItem'
import { NoteFilter } from './NoteFilter'

interface NoteListProps {
  notes: Note[]
  categories: NoteCategory[]
  selectedFilter: NoteCategoryFilter
  onFilterChange: (filter: NoteCategoryFilter) => void
  onView: (note: Note) => void
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
  onAddNew: () => void
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
  isLoading = false,
}: NoteListProps) {
  const categoryMap = useMemo(() => {
    const map = new Map<string, NoteCategory>()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            ノート
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            日々のメモや記録をカテゴリごとに管理します
          </p>
        </div>
        <Button
          onClick={onAddNew}
          className="h-10 px-4 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>ノートを追加</span>
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
          <div className="h-7 w-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-3">
          <p className="text-sm text-slate-400">
            {selectedFilter === 'all'
              ? '登録されているノートがありません'
              : '該当するノートがありません'}
          </p>
          {selectedFilter === 'all' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddNew}
              className="cursor-pointer"
            >
              最初のノートを登録
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              category={
                note.category_id ? categoryMap.get(note.category_id) : undefined
              }
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
