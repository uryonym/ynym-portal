import { type Task } from '@/generated/client'

import TaskFormSheet from './TaskFormSheet'
import TaskList from './TaskList'
import { getTasks } from '../actions/tasks'

export default async function Task() {
  const tasks = await getTasks()

  return (
    <div className="p-3">
      <p className="mb-2 text-xl font-bold">タスクページ</p>
      <TaskFormSheet mode="create" />
      <TaskList tasks={tasks} />
    </div>
  )
}
