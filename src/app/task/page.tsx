import React from 'react'

import { type Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'
import { getTasks } from '../actions/tasks'

export default async function Task() {
  const { tasks, error } = await getTasks()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-bold">タスクページ</p>
      <TaskFormSheet mode="create" />
      {/* タスク一覧: シンプルなリスト形式（タイトルと期日のみ） */}
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white shadow">
        {(tasks ?? []).map((task) => (
          <li key={task.id} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-gray-900">{task.title}</span>
            <span className="text-sm text-gray-500">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </span>
            <TaskFormSheet mode="edit" task={task} />
          </li>
        ))}
      </ul>
    </div>
  )
}
