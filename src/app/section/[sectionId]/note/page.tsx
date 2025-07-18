import React from 'react'

// TODO: ノートデータ取得処理を実装

export default async function NotesPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params

  // 仮のノートデータ
  const notes = [
    { id: 1, title: 'ノートA' },
    { id: 2, title: 'ノートB' },
  ]

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">セクション {sectionId} のノート一覧</h2>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="rounded border bg-gray-50 p-2">
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
