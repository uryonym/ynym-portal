import { useState, useEffect, useRef, useCallback } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { TipTapEditor } from '@/components/editor/TipTapEditor'
import { NoteDeleteDialog } from '@/components/notes/NoteDeleteDialog'
import { NoteEditorHeader } from '@/components/notes/NoteEditorHeader'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNoteCategoriesQuery } from '@/hooks/queries/useNoteCategories'
import {
  useNoteQuery,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '@/hooks/queries/useNotes'

export const Route = createFileRoute('/_authenticated/notes/$noteId')({
  component: NoteDetailPage,
})

function NoteDetailPage() {
  const { noteId } = Route.useParams()
  const navigate = useNavigate()

  const { data: note, isLoading, isError } = useNoteQuery(noteId)
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useNoteCategoriesQuery()
  const { mutateAsync: updateNoteAsync } = useUpdateNoteMutation()
  const { mutateAsync: deleteNoteAsync, isPending: isDeleting } =
    useDeleteNoteMutation()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved',
  )
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // 初期ロード完了フラグと変更フラグ
  const isInitializedRef = useRef(false)
  const isDirtyRef = useRef(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 取得した note データの初期反映
  useEffect(() => {
    if (note && !isInitializedRef.current) {
      setTitle(note.title)
      setBody(note.body)
      setCategoryId(note.category_id ?? '')
      setIsPinned(note.is_pinned)
      setLastSavedAt(new Date(note.updated_at))
      setSaveStatus('saved')
      isInitializedRef.current = true
    }
  }, [note])

  // 保存実行関数
  const handleSave = useCallback(
    async (
      saveTitle = title,
      saveBody = body,
      saveCategoryId = categoryId,
      saveIsPinned = isPinned,
    ) => {
      if (!isDirtyRef.current) return

      const trimmedTitle = saveTitle.trim() || '無題のノート'
      const trimmedBody = saveBody.trim() || ' '

      setSaveStatus('saving')
      try {
        await updateNoteAsync({
          id: noteId,
          data: {
            title: trimmedTitle,
            body: trimmedBody,
            category_id: saveCategoryId || undefined,
            is_pinned: saveIsPinned,
          },
        })
        isDirtyRef.current = false
        setSaveStatus('saved')
        setLastSavedAt(new Date())
      } catch (err) {
        console.error('Failed to auto-save note:', err)
        setSaveStatus('unsaved')
        toast.error('ノートの保存に失敗しました')
      }
    },
    [noteId, title, body, categoryId, isPinned, updateNoteAsync],
  )

  // 変更検知とデバウンス保存
  const triggerAutoSave = useCallback(
    (
      newTitle: string,
      newBody: string,
      newCategoryId: string,
      newIsPinned: boolean,
    ) => {
      if (!isInitializedRef.current) return

      isDirtyRef.current = true
      setSaveStatus('unsaved')

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        handleSave(newTitle, newBody, newCategoryId, newIsPinned)
      }, 1500)
    },
    [handleSave],
  )

  // アンマウント時のタイマー解除
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 画面離脱前に変更があれば保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirtyRef.current) {
        handleSave()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleSave])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    triggerAutoSave(newTitle, body, categoryId, isPinned)
  }

  const handleBodyChange = (newBody: string) => {
    setBody(newBody)
    triggerAutoSave(title, newBody, categoryId, isPinned)
  }

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId)
    triggerAutoSave(title, body, newCategoryId, isPinned)
  }

  const handleTogglePin = async () => {
    const nextPinned = !isPinned
    setIsPinned(nextPinned)
    isDirtyRef.current = true
    await handleSave(title, body, categoryId, nextPinned)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteNoteAsync(noteId)
      setIsDeleteOpen(false)
      navigate({ to: '/notes' })
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  if (isLoading || isCategoriesLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-4 p-4 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !note) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          ノートが見つかりませんでした
        </h2>
        <p className="text-sm text-slate-500">
          削除されたか、アクセス権限がない可能性があります。
        </p>
        <Button
          onClick={() => navigate({ to: '/notes' })}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          ノート一覧に戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-50/30 pb-16">
      {/* Sticky Header */}
      <NoteEditorHeader
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        isPinned={isPinned}
        onTogglePin={handleTogglePin}
        onSave={() => handleSave()}
        onDelete={() => setIsDeleteOpen(true)}
        isDeleting={isDeleting}
      />

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 space-y-4">
        {/* Title Input (Notion-like large borderless input) */}
        <div className="px-2">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="無題のノート"
            className="w-full text-2xl sm:text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent focus:ring-0 leading-tight"
          />
        </div>

        {/* TipTap WYSIWYG Markdown Editor */}
        <TipTapEditor
          content={body}
          onChange={handleBodyChange}
          placeholder="何を書きますか？ '/' でコマンドを表示..."
          className="min-h-[500px]"
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <NoteDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        note={note}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}
