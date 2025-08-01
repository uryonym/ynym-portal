import React from 'react'

import { getNotes } from '@/app/actions/notes'
import { getSection } from '@/app/actions/sections'

import NoteList from './NoteList'

export default async function NotesPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params

  const section = await getSection(sectionId)
  const notes = await getNotes(sectionId)

  return (
    <div className="p-3">
      <p className="mb-2 text-xl font-bold">{section?.name} のノート一覧</p>
      <NoteList notes={notes} sectionId={sectionId} />
    </div>
  )
}
