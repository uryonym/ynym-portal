'use client'

import { useEffect, useState } from 'react'

import { createNote, deleteNote, updateNote } from '@/app/actions/notes'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Note } from '@/generated/client'

type NoteFormSheetProps = {
  mode: 'create' | 'edit'
  sectionId: string
  note?: Note | null
}

const NoteFormSheet = ({ mode = 'create', sectionId, note }: NoteFormSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    seq: '',
  })

  useEffect(() => {
    if (mode === 'edit' && note) {
      setForm({
        title: note.title,
        content: note.content,
        seq: note.seq.toString(),
      })
    } else {
      setForm({ title: '', content: '', seq: '' })
    }
  }, [mode, note, internalOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('sectionId', sectionId)
    if (mode === 'edit' && note) {
      formData.append('id', note.id)
      await updateNote(formData)
      setInternalOpen(false)
    } else {
      await createNote(formData)
      setInternalOpen(false)
    }
  }

  const handleDelete = async () => {
    if (!note) return
    const formData = new FormData()
    formData.append('id', note.id)
    await deleteNote(formData)
    setInternalOpen(false)
  }

  return (
    <>
      {mode === 'create' && (
        <button
          className="mb-2 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={() => setInternalOpen(true)}
        >
          新規作成
        </button>
      )}
      {mode === 'edit' && (
        <button
          type="button"
          className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
          onClick={() => setInternalOpen(true)}
        >
          編集
        </button>
      )}
      <Drawer open={internalOpen} onOpenChange={setInternalOpen} autoFocus>
        <DrawerContent className="mx-auto max-w-xl">
          <DrawerHeader>
            <DrawerTitle>{mode === 'edit' ? 'ノート集' : 'ノート追加'}</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
            <div>
              <label className="mb-1 block font-medium">
                タイトル
                <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ノートタイトル"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">
                内容
                <span className="text-red-500">*</span>
              </label>
              <input
                name="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="ノート内容"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">順序</label>
              <input
                name="seq"
                type="number"
                value={form.seq}
                onChange={(e) => setForm({ ...form, seq: e.target.value })}
                placeholder="順序"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
              <button
                type="submit"
                className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                {mode === 'edit' ? '保存' : '追加'}
              </button>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
                >
                  削除
                </button>
              )}
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NoteFormSheet
