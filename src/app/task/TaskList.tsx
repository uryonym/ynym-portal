'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Task } from '@/generated/client'

import { updateTask } from '../actions/tasks'

type Props = {
  tasks: Task[]
  onSuccess?: () => void
}
export default function TaskList({ tasks, onSuccess }: Props) {
  const handleCompletedChange = async (task: Task) => {
    await updateTask({
      ...task,
      description: task.description ?? undefined,
      completed: !task.completed,
    })
    onSuccess?.()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">完了</TableHead>
          <TableHead>タイトル</TableHead>
          <TableHead>期限</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleCompletedChange(task)}
              />
            </TableCell>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
