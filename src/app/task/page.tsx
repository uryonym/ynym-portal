import React from 'react'

import { type Task } from '@/generated/client'

import TaskFromSheet from './TaskFormSheet'
import TaskTable from './TaskTable'
import { getTasks } from '../actions/tasks'

const Task = async () => {
  const { tasks, error } = await getTasks()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-bold">タスクページ</p>
      <TaskFromSheet />
      <div className="overflow-x-auto">
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
          {tasks && <TaskTable tasks={tasks} />}
        </table>
      </div>
    </div>
  )
}

export default Task
