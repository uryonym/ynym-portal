import TaskList from './TaskList'
import { getTasks } from '../actions/tasks'

export default async function TaskPage({
  searchParams,
}: {
  searchParams: Promise<{ completed: string }>
}) {
  const completed = (await searchParams).completed === 'true'
  const tasks = await getTasks({ completed })

  return (
    <div className="p-3">
      <p className="mb-2 text-xl font-bold">タスクページ</p>
      <TaskList initialTasks={tasks} showCompleted={completed} />
    </div>
  )
}
