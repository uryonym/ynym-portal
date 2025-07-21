'use client'

import { useCallback, useEffect, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { type Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'
import TaskList from './TaskList'
import { getTasks } from '../actions/tasks'

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCompleted, setShowCompleted] = useState(false)

  const fetchTasks = useCallback(async () => {
    const tasks = await getTasks({ completed: showCompleted })
    setTasks(tasks)
  }, [showCompleted])

  useEffect(() => {
    void fetchTasks()
  }, [fetchTasks])

  return (
    <div className="p-3">
      <p className="mb-2 text-xl font-bold">タスクページ</p>
      <div className="flex justify-between">
        <TaskFormSheet mode="create" onSuccess={fetchTasks} />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
          />
          <Label htmlFor="show-completed">完了タスク表示</Label>
        </div>
      </div>
      <TaskList tasks={tasks} onSuccess={fetchTasks} />
    </div>
  )
}
