import React from 'react'

import { getNote } from '@/app/actions/notes'

import NoteContent from './NoteContent'

export default async function NotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params

  const note = await getNote(noteId)

  return (
    <div className="p-3">
      {note ? (
        <NoteContent note={note} />
      ) : (
        <p className="mb-2 text-xl font-bold">ノートが見つかりません</p>
      )}
    </div>
  )
}
