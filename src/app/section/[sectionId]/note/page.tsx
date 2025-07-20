import React from 'react'

import { getNotes } from '@/app/actions/notes'

import NoteFormSheet from './NoteFormSheet'

export default async function NotesPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params

  const notes = await getNotes()

  return (
    <div className="py-2">
      <h2 className="mb-2 text-xl font-bold">セクション {sectionId} のノート一覧</h2>
      <NoteFormSheet mode="create" sectionId={sectionId} />
      <ul className="space-y-1">
        {notes.map((note) => (
          <li key={note.id} className="rounded border bg-gray-50 p-2">
            <div className="flex items-center justify-between gap-2">
              <span>{note.title}</span>
              <NoteFormSheet mode="edit" sectionId={sectionId} note={note} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
