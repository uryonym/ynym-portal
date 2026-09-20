'use client'
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
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            ノートカテゴリ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ノートを分類・整理するためのカテゴリを管理します
          </p>
        </div>
        <Button
          onClick={onAddNew}
          className="h-10 px-4 gap-2 w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>カテゴリを追加</span>
        </Button>
      </div>

      {/* カテゴリ一覧 */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-7 w-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-3">
          <p className="text-sm text-slate-400">
            登録されているカテゴリがありません
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNew}
            className="cursor-pointer"
          >
            最初のカテゴリを登録
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
