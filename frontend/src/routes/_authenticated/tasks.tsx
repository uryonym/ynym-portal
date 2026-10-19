import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { TaskDialog } from '@/components/TaskDialog'
import { TaskList } from '@/components/TaskList'
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
} from '@/hooks/queries/useTasks'

import type { TaskFilter } from '@/lib/api/tasks'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>('active')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: tasks = [], isLoading: isTasksLoading } = useTasksQuery(filter)
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const toggleMutation = useToggleTaskMutation()
  const deleteMutation = useDeleteTaskMutation()

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  const handleOpenDialog = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (taskToEdit: Task) => {
    setEditingTask(taskToEdit)
    setIsDialogOpen(true)
  }

  const handleToggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      toggleMutation.mutate({ id, isCompleted: !task.is_completed })
    }
  }

  const handleSubmitForm = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      if (editingTask) {
        await updateMutation.mutateAsync({ id: editingTask.id, data })
      } else {
        await createMutation.mutateAsync(data as CreateTaskInput)
      }
      setIsDialogOpen(false)
    } catch {
      // エラーは mutation 内の onError (トースト) で処理
    }
  }

  const handleDeleteTask = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onAddNew={handleOpenDialog}
          filter={filter}
          onFilterChange={setFilter}
          isLoading={isTasksLoading}
        />
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingTask}
        onSubmit={handleSubmitForm}
        onDelete={handleDeleteTask}
        isLoading={isMutating}
      />
    </>
  )
}
