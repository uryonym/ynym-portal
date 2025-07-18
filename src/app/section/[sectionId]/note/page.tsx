import React from 'react'

import { getNotes } from '@/app/actions/notes'

import NoteFormSheet from './NoteFormSheet'

export default async function NotesPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params

  const { notes, error } = await getNotes()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">セクション {sectionId} のノート一覧</h2>
      <NoteFormSheet mode="create" />
      <ul className="space-y-2">
        {(notes ?? []).map((note) => (
          <li key={note.id} className="rounded border bg-gray-50 p-2">
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
