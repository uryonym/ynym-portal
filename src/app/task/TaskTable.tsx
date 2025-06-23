'use client'

import { Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'

export default function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
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
            <TaskFormSheet mode="edit" task={task} />
          </td>
        </tr>
      ))}
    </tbody>
  )
}
