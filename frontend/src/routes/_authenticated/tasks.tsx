import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { TaskDialog } from '@/components/TaskDialog'
import { TaskList } from '@/components/TaskList'
import { useTasks } from '@/hooks/queries/useTasks'

import type { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TasksPage,
})
function TasksPage() {
  const {
    tasks,
    isLoading,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filter,
    setFilter,
  } = useTasks()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleOpenDialog = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }
  const handleEditTask = (taskToEdit: Task) => {
    setEditingTask(taskToEdit)
    setIsDialogOpen(true)
  }
  const handleSubmitForm = (data: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
    } else {
      addTask(data as CreateTaskInput)
    }
    setIsDialogOpen(false)
  }
  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onEdit={handleEditTask}
          onAddNew={handleOpenDialog}
          filter={filter}
          onFilterChange={setFilter}
          isLoading={isLoading}
        />
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingTask}
        onSubmit={handleSubmitForm}
        onDelete={deleteTask}
        isLoading={isLoading}
      />
    </>
  )
}
