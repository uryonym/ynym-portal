'use client'

import { useState, useEffect } from 'react'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Section } from '@/generated/client'

import { createSection, updateSection, deleteSection } from '../actions/sections'

type SectionFormSheetProps = {
  mode?: 'create' | 'edit'
  section?: Section | null
}

const SectionFormSheet = ({ mode = 'create', section }: SectionFormSheetProps) => {
  // mode=createのときだけ内部でopenを管理
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    seq: '',
  })

  useEffect(() => {
    if (mode === 'edit' && section) {
      setForm({
        name: section.name,
        seq: section.seq.toString(),
      })
    } else {
      setForm({ name: '', seq: '' })
    }
  }, [mode, section, internalOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (mode === 'edit' && section) {
      formData.append('id', section.id)
      await updateSection(formData)
      setInternalOpen(false)
    } else {
      await createSection(formData)
      setInternalOpen(false)
    }
  }

  const handleDelete = async () => {
    if (!section) return
    const formData = new FormData()
    formData.append('id', section.id)
    await deleteSection(formData)
    setInternalOpen(false)
  }

  return (
    <>
      {mode === 'create' && (
        <button
          className="mb-8 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={() => setInternalOpen(true)}
        >
          セクションを追加
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
      <Drawer open={internalOpen} onOpenChange={setInternalOpen}>
        <DrawerContent className="mx-auto max-w-xl">
          <DrawerHeader>
            <DrawerTitle>{mode === 'edit' ? 'セクション編集' : 'セクション追加'}</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
            <div>
              <label className="mb-1 block font-medium">
                名前
                <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="セクション名"
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

export default SectionFormSheet
