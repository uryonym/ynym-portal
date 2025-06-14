'use client'

import { useState } from 'react'

import { Task } from '@/../generated/client'

import TaskFormSheet from './TaskFormSheet'

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <TaskFormSheet mode="edit" task={editTask} open={sheetOpen} onOpenChange={setSheetOpen} />
      <tbody>
        {tasks.map((task) => (
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
                onClick={() => {
                  setEditTask(task)
                  setSheetOpen(true)
                }}
                className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
              >
                編集
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  )
}
