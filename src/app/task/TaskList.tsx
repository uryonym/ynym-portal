'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { type Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'
import { updateTask } from '../actions/tasks'

export default function TaskList({
  initialTasks,
  showCompleted,
}: {
  initialTasks: Task[]
  showCompleted: boolean
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task>()
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleNewTaskClick = () => {
    setSelectedTask(undefined)
    setFormMode('create')
    setIsOpen(true)
  }

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setFormMode('edit')
    setIsOpen(true)
  }

  const handleCompletedChange = async (task: Task) => {
    await updateTask({
      ...task,
      description: task.description ?? undefined,
      dueDate: task.dueDate ?? undefined,
      completed: !task.completed,
    })
  }

  const handleShowCompletedChange = (checked: boolean) => {
    router.replace(`/task?completed=${checked ? 'true' : 'false'}`)
  }

  return (
    <>
      <div className="mb-4 flex justify-between">
        <button
          className="mb-2 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={handleNewTaskClick}
        >
          新規タスク追加
        </button>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={handleShowCompletedChange}
          />
          <Label htmlFor="show-completed">完了タスク表示</Label>
        </div>
      </div>
      <ul className="space-y-1">
        {initialTasks.map((task) => (
          <li
            key={task.id}
            className="flex cursor-pointer items-start rounded border border-gray-200 bg-white p-3 hover:bg-gray-50"
            onClick={() => handleRowClick(task)}
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => {
                void handleCompletedChange(task)
              }}
              className="mt-1 mr-3"
            />
            <div className="flex flex-col">
              <span
                className={
                  task.completed ? 'text-gray-400 line-through' : 'font-medium text-gray-900'
                }
              >
                {task.title}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <TaskFormSheet mode={formMode} task={selectedTask} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
