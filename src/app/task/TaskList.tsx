'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {} from // ...existing code...
'@/components/ui/table'
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleCompletedChange = async (task: Task) => {
    await updateTask({
      ...task,
      description: task.description ?? undefined,
      completed: !task.completed,
    })
  }

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }

  const handleShowCompletedChange = (checked: boolean) => {
    router.replace(`/task?completed=${checked ? 'true' : 'false'}`)
  }

  return (
    <>
      <div className="mb-4 flex justify-between">
        <TaskFormSheet mode="create" />
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
      <TaskFormSheet
        mode="edit"
        task={selectedTask}
        onSuccess={() => setIsSheetOpen(false)}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  )
}
