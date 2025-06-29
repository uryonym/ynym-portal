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
      {/* PC/tablet: テーブル表示 */}
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">タイトル</th>
              <th className="border border-gray-300 px-4 py-2 text-left">説明</th>
              <th className="border border-gray-300 px-4 py-2 text-left">期限</th>
              <th className="border border-gray-300 px-4 py-2 text-left">完了</th>
              <th className="border border-gray-300 px-4 py-2 text-left">作成日</th>
              <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {(tasks ?? []).map((task) => (
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
                  <TaskFormSheet mode="edit" task={task} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* モバイル: カード型リスト表示 */}
      <div className="space-y-4 md:hidden">
        {(tasks ?? []).map((task) => (
          <div key={task.id} className="rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-lg font-bold">{task.title}</span>
              <TaskFormSheet mode="edit" task={task} />
            </div>
            <div className="mb-1 text-gray-600">
              <span className="font-semibold">説明:</span> {task.description ?? '-'}
            </div>
            <div className="mb-1 text-gray-600">
              <span className="font-semibold">期限:</span>{' '}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </div>
            <div className="mb-1 text-gray-600">
              <span className="font-semibold">完了:</span> {task.completed ? '✔️' : ''}
            </div>
            <div className="text-xs text-gray-400">
              <span className="font-semibold">作成日:</span>{' '}
              {new Date(task.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
