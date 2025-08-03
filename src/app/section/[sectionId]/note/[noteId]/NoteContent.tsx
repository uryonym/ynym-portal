'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { updateNote } from '@/app/actions/notes'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Note } from '@/generated/client'

type NoteContentProps = {
  note: Note
}

export default function NoteContent({ note }: NoteContentProps) {
  const router = useRouter()

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

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <p>{note.title}</p>
      <form className="flex flex-1 flex-col gap-2" onSubmit={handleSubmit}>
        <textarea
          className="flex-1 resize-none overflow-auto focus:outline-0"
          name="content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <div className="flex justify-between">
          <Button variant="link" onClick={handleBack}>
            戻る
          </Button>
          <Button className="mt-2" type="submit">
            保存
          </Button>
        </div>
      </form>
    </div>
  )
}
