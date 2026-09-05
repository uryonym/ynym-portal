'use client'

import { useState } from 'react'
import { TodoList } from '@/components/TodoList'
import { TodoDialog } from '@/components/TodoDialog'
import { useTodos } from '@/hooks/useTodos'
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/types/todo'

export default function TasksPage() {
  const {
    todos,
    isLoading,
    editingTodo,
    setEditingTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    filter,
    setFilter,
  } = useTodos()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setEditingTodo(null)
    setIsDialogOpen(true)
  }

  const handleEditTodo = (todoToEdit: Todo) => {
    setEditingTodo(todoToEdit)
    setIsDialogOpen(true)
  }

  const handleSubmitForm = (data: CreateTodoInput | UpdateTodoInput) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data as UpdateTodoInput)
    } else {
      addTodo(data as CreateTodoInput)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6">
        <TodoList
          todos={todos}
          onToggleComplete={toggleComplete}
          onEdit={handleEditTodo}
          onAddNew={handleOpenDialog}
          filter={filter}
          onFilterChange={setFilter}
          isLoading={isLoading}
        />
      </main>

      <TodoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingTodo}
        onSubmit={handleSubmitForm}
        onDelete={deleteTodo}
        isLoading={isLoading}
      />
    </>
  )
}
