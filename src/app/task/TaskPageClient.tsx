'use client'

import { useRouter } from 'next/navigation'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'
import TaskList from './TaskList'

export default function TaskPageClient({
  initialTasks,
  showCompleted,
}: {
  initialTasks: Task[]
  showCompleted: boolean
}) {
  const router = useRouter()

  const handleChange = (checked: boolean) => {
    router.replace(`/task?completed=${checked ? 'true' : 'false'} `)
  }

  return (
    <>
      <div className="flex justify-between">
        <TaskFormSheet mode="create" />
        <div className="flex items-center space-x-2">
          <Checkbox id="show-completed" checked={showCompleted} onCheckedChange={handleChange} />
          <Label htmlFor="show-completed">完了タスク表示</Label>
        </div>
      </div>
      <TaskList tasks={initialTasks} />
    </>
  )
}
