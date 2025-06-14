import { prisma } from '@/lib/prisma'

// Task型を定義
type TaskType = {
  id: string
  title: string
  description?: string | null
  dueDate?: Date | string | null
  completed: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

const getTasks = async (): Promise<TaskType[]> => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { createdAt: 'desc' } })
    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

const Task = async () => {
  const tasks = await getTasks()

  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-bold">タスクページ</p>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">タイトル</th>
              <th className="border border-gray-300 px-4 py-2 text-left">説明</th>
              <th className="border border-gray-300 px-4 py-2 text-left">期限</th>
              <th className="border border-gray-300 px-4 py-2 text-left">完了</th>
              <th className="border border-gray-300 px-4 py-2 text-left">作成日</th>
            </tr>
          </thead>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Task
