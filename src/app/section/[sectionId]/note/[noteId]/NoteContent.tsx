'use client'

import { useEffect, useState } from 'react'

import { updateNote } from '@/app/actions/notes'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Note } from '@/generated/client'

type NoteContentProps = {
  note: Note
}

export default function NoteContent({ note }: NoteContentProps) {
  const [form, setForm] = useState({
    content: '',
  })

  useEffect(() => {
    setForm({
      content: note.content,
    })
  }, [note])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('id', note.id)
    formData.append('title', note.title)
    formData.append('seq', note.seq.toString())
    await updateNote(formData)
  }

  return (
    <>
      <p>{note.title}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
        <Textarea name="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <div className="mt-2 flex w-full items-center justify-between">
          <Button type="submit">保存</Button>
        </div>
      </form>
    </>
  )
}
