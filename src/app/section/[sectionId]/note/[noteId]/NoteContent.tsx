'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { updateNote } from '@/app/actions/notes'
import { Button } from '@/components/ui/button'
import { Note } from '@/generated/client'
import { Loader2Icon } from 'lucide-react'
import LoadingButton from '@/components/LoadingButton'

type NoteContentProps = {
  note: Note
}

export default function NoteContent({ note }: NoteContentProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    content: '',
  })

  useEffect(() => {
    setForm({
      content: note.content,
    })
  }, [note])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.append('id', note.id)
    formData.append('title', note.title)
    formData.append('seq', note.seq.toString())
    await updateNote(formData)

    setIsLoading(false)
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
          <LoadingButton title="保存" isLoading={isLoading} />
        </div>
      </form>
    </div>
  )
}
