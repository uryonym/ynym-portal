'use client'
import { useState } from 'react'

type TaskType = {
  id: string
  title: string
  description?: string | null
  dueDate?: Date | string | null
  completed: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export default function EditableTaskRow({ task, onEdit }: { task: TaskType; onEdit: () => void }) {
  const [editValues, setEditValues] = useState({
    title: task.title,
    description: task.description ?? '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
  })

  return (
    <form action={onEdit} className="contents">
      <input type="hidden" name="id" value={task.id} />
      <td className="border border-gray-300 px-4 py-2">
        <input
          name="title"
          type="text"
          required
          value={editValues.title}
          onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <input
          name="description"
          type="text"
          value={editValues.description}
          onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <input
          name="dueDate"
          type="date"
          value={editValues.dueDate}
          onChange={(e) => setEditValues((v) => ({ ...v, dueDate: e.target.value }))}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">{task.completed ? '✔️' : ''}</td>
      <td className="border border-gray-300 px-4 py-2">
        {new Date(task.createdAt).toLocaleString()}
      </td>
      <td className="flex gap-2 border border-gray-300 px-4 py-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded bg-gray-400 px-3 py-1 text-white hover:bg-gray-500"
        >
          キャンセル
        </button>
      </td>
    </form>
  )
}
