'use client'

import React, { useState, useEffect } from 'react'

import { type Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'
import { getTasks } from '../actions/tasks'

export default function Task() {
  const [tasks, setTasks] = useState<Task[]>()
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      const { tasks } = await getTasks()
      setTasks(tasks)
    }
    void fetchTasks()
  }, [])

  const sortByDueDate = (a: Task, b: Task) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  }
  const incompleteTasks = (tasks ?? []).filter((task) => !task.completed).sort(sortByDueDate)
  const completedTasks = (tasks ?? []).filter((task) => task.completed).sort(sortByDueDate)

  return (
    <div className="p-3">
      <p className="mb-2 text-xl font-bold">タスクページ</p>
      <TaskFormSheet mode="create" />
      {/* 未完了タスク一覧 */}
      <p className="my-2 font-semibold text-gray-800">未完了タスク</p>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white shadow">
        {incompleteTasks.length === 0 && (
          <li className="px-4 py-3 text-gray-400">未完了タスクはありません</li>
        )}
        {incompleteTasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-gray-900">{task.title}</span>
            <span className="text-sm text-gray-500">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </span>
            <TaskFormSheet mode="edit" task={task} />
          </li>
        ))}
      </ul>
      {/* 完了タスク一覧 折りたたみ */}
      <div className="my-2">
        <button
          type="button"
          className="flex items-center gap-2 font-semibold text-gray-800"
          onClick={() => setShowCompleted((prev) => !prev)}
          aria-expanded={showCompleted}
        >
          <span>{showCompleted ? '▼' : '▶'}</span>
          完了タスク（{completedTasks.length}）
        </button>
        {showCompleted && (
          <ul className="mt-2 divide-y divide-gray-200 rounded-lg border border-gray-300 bg-white shadow">
            {completedTasks.length === 0 && (
              <li className="px-4 py-3 text-gray-400">完了タスクはありません</li>
            )}
            {completedTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between px-4 py-3 opacity-60">
                <span className="font-medium text-gray-900 line-through">{task.title}</span>
                <span className="text-sm text-gray-500">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </span>
                <TaskFormSheet mode="edit" task={task} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
