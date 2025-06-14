'use client'

import { useState } from 'react'

import { Task } from '@/generated/client'

import EditableTaskRow from './EditableTaskRow'

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  const [editId, setEditId] = useState<string | null>(null)

  return (
    <tbody>
      {tasks.map((task) =>
        editId === task.id ? (
          <EditableTaskRow key={task.id} task={task} onEdit={() => setEditId(null)} />
        ) : (
          <tr key={task.id} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2">{task.title}</td>
            <td className="border border-gray-300 px-4 py-2">{task.description ?? '-'}</td>
            <td className="border border-gray-300 px-4 py-2">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {task.completed ? '✔️' : ''}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {new Date(task.createdAt).toLocaleString()}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                type="button"
                onClick={() => setEditId(task.id)}
                className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
              >
                編集
              </button>
            </td>
          </tr>
        ),
      )}
    </tbody>
  )
}
