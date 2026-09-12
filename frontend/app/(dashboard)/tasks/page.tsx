'use client'

import { useState } from 'react'
import { TaskList } from '@/components/TaskList'
import { TaskDialog } from '@/components/TaskDialog'
import { useTasks } from '@/hooks/useTasks'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task'

export default function TasksPage() {
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
      updateTask(editingTask.id, data as UpdateTaskInput)
    } else {
      addTask(data as CreateTaskInput)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <TaskList
          tasks={tasks}
          onToggleComplete={toggleComplete}
          onEdit={handleEditTask}
          onAddNew={handleOpenDialog}
          filter={filter}
          onFilterChange={setFilter}
          isLoading={isLoading}
        />
      </main>

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
