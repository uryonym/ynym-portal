import { useState, useRef, useCallback } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { TipTapEditor } from '@/components/editor/TipTapEditor'
import { NoteEditorHeader } from '@/components/notes/NoteEditorHeader'
import { useNoteCategoriesQuery } from '@/hooks/queries/useNoteCategories'
import { useCreateNoteMutation } from '@/hooks/queries/useNotes'

export const Route = createFileRoute('/_authenticated/notes/new')({
  component: NewNotePage,
})

function NewNotePage() {
  const navigate = useNavigate()
  const { data: categories = [] } = useNoteCategoriesQuery()
  const { mutateAsync: createNoteAsync } = useCreateNoteMutation()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved',
  )

  const isCreatingRef = useRef(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleCreate = useCallback(
    async (
      createTitle = title,
      createBody = body,
      createCategoryId = categoryId,
    ) => {
      if (isCreatingRef.current) return
      // まだ何も入力されていない場合は作成しない
      if (!createTitle.trim() && !createBody.trim()) return

      isCreatingRef.current = true
      setSaveStatus('saving')

      try {
        const response = await createNoteAsync({
          title: createTitle.trim() || '無題のノート',
          body: createBody.trim() || ' ',
          category_id: createCategoryId || undefined,
        })

        const newNoteId = response.data.id
        setSaveStatus('saved')
        toast.success('ノートを作成しました')

        // 作成成功後は新ノートの詳細・編集画面へシームレスに切り替え
        navigate({
          to: '/notes/$noteId',
          params: { noteId: newNoteId },
          replace: true,
        })
      } catch (err) {
        console.error('Failed to create new note:', err)
        isCreatingRef.current = false
        setSaveStatus('unsaved')
        toast.error('ノートの作成に失敗しました')
      }
    },
    [title, body, categoryId, createNoteAsync, navigate],
  )

  const triggerAutoCreate = useCallback(
    (newTitle: string, newBody: string, newCategoryId: string) => {
      setSaveStatus('unsaved')

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        handleCreate(newTitle, newBody, newCategoryId)
      }, 1500)
    },
    [handleCreate],
  )

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    triggerAutoCreate(newTitle, body, categoryId)
  }

  const handleBodyChange = (newBody: string) => {
    setBody(newBody)
    triggerAutoCreate(title, newBody, categoryId)
  }

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId)
    triggerAutoCreate(title, body, newCategoryId)
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-50/30 pb-16">
      {/* Sticky Header */}
      <NoteEditorHeader
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        saveStatus={saveStatus}
        lastSavedAt={null}
        onSave={() => handleCreate()}
      />

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 space-y-4">
        {/* Title Input */}
        <div className="px-2">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="無題のノート"
            autoFocus
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
    </div>
  )
}
