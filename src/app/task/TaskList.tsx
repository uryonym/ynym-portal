'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
      <div className="flex justify-between">
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">完了</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead>期限</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialTasks.map((task) => (
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
        onSuccess={() => setIsSheetOpen(false)}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  )
}
