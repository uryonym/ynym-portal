import { supabase } from '~/lib/supabase'
import type { Route } from './+types/task'

export async function clientLoader() {
  const { data: tasks, error } = await supabase.from('tasks').select()
  return { tasks, error }
}

export default function Task({ loaderData }: Route.ComponentProps) {
  const data = loaderData.tasks

  return (
    <div className="flex-1 flex flex-col gap-3 p-2">
      <div>
        <button className="underline" type="button" onClick={}>
          新規作成
        </button>
      </div>
      <ul>
        {incompleteTasks &&
          incompleteTasks.map((task) => (
            <li className="flex gap-3 items-center p-2 border-b-2" key={task.id} onClick={() => handleClickEdit(task)}>
              <div>
                <input type="checkbox" defaultChecked={task.isComplete} />
              </div>
              <div>
                <p>{task.title}</p>
                <p className="text-sm">{task.deadLine?.toLocaleDateString('ja-JP')}</p>
              </div>
            </li>
          ))}
      </ul>
      <p>完了済タスク</p>
      <ul>
        {completeTasks &&
          completeTasks.map((task) => (
            <li className="flex gap-3 items-center p-2 border-b-2" key={task.id} onClick={() => handleClickEdit(task)}>
              <div>
                <input type="checkbox" defaultChecked={task.isComplete} />
              </div>
              <div>
                <p>{task.title}</p>
                <p className="text-sm">{task.deadLine?.toLocaleDateString('ja-JP')}</p>
              </div>
            </li>
          ))}
      </ul>
      <TaskModal show={openModal} onClose={handleCloseModal} task={currentTask} />
    </div>
  )
}
