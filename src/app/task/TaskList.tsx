'use client'

import { useState } from 'react'

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

import TaskFormSheet from './TaskFormSheet'
import { updateTask } from '../actions/tasks'

type Props = {
  tasks: Task[]
  onSuccess?: () => void
}
export default function TaskList({ tasks, onSuccess }: Props) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleCompletedChange = async (task: Task) => {
    await updateTask({
      ...task,
      description: task.description ?? undefined,
      completed: !task.completed,
    })
    onSuccess?.()
  }

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }

  return (
    <>
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
            <TableRow key={task.id} onClick={() => handleRowClick(task)}>
              <TableCell
                onClick={(e: React.MouseEvent<HTMLTableCellElement>) => {
                  e.stopPropagation()
                }}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleCompletedChange(task)}
                />
              </TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TaskFormSheet
        mode="edit"
        task={selectedTask}
        onSuccess={() => {
          onSuccess?.()
          setIsSheetOpen(false)
        }}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  )
}
