import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { NoteCategoryItem } from './NoteCategoryItem'

import type { NoteCategory } from '@/lib/types/note-category'

interface NoteCategoryListProps {
  categories: NoteCategory[]
  onEdit: (category: NoteCategory) => void
  onDelete: (category: NoteCategory) => void
  onAddNew: () => void
  isLoading?: boolean
}
export function NoteCategoryList({
  categories,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}: NoteCategoryListProps) {
  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          カテゴリ
        </h1>
        <Button
          onClick={onAddNew}
          className="h-9 px-3.5 gap-1.5 rounded-lg cursor-pointer text-xs sm:text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>追加</span>
        </Button>
      </div>

      {/* カテゴリ一覧 */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-14 bg-card rounded-xl border border-border/80 p-8 space-y-3">
          <p className="text-sm text-muted-foreground">カテゴリがありません</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNew}
            className="cursor-pointer rounded-lg"
          >
            カテゴリを追加
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categories.map((category) => (
            <NoteCategoryItem
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
