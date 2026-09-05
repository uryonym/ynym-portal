'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/types/todo'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  TaskFilter,
} from '@/lib/api/todos'
import { toast } from 'sonner'

// タスクのソート関数
// 1. 未完了 → 完了済み
// 2. 期日の昇順（期日なしは最後）
// 3. 作成日時の古い順
function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1
    }

    if (a.due_date !== b.due_date) {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    }

    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<TaskFilter>('active')

  const sortedTodos = useMemo(() => sortTodos(todos), [todos])

  // データ再取得用の内部関数
  const refreshTasks = useCallback(async (currentFilter: TaskFilter) => {
    setIsLoading(true)
    try {
      const response = await fetchTasks(currentFilter)
      setTodos(response.data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
      setTodos([])
      toast.error('タスク一覧の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await fetchTasks(filter)
        if (!ignore) {
          setTodos(response.data)
        }
      } catch (error) {
        console.error('Failed to load tasks:', error)
        if (!ignore) {
          setTodos([])
          toast.error('タスク一覧の取得に失敗しました')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [filter])

  const handleFilterChange = useCallback((newFilter: TaskFilter) => {
    setIsLoading(true)
    setFilter(newFilter)
  }, [])

  // 新規追加
  const addTodo = useCallback(
    async (data: CreateTodoInput) => {
      setIsLoading(true)
      try {
        await createTask(data)
        await refreshTasks(filter)
        toast.success('タスクを作成しました')
      } catch (error) {
        console.error('Failed to create task:', error)
        toast.error('タスクの作成に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [filter, refreshTasks],
  )

  // 更新
  const updateTodo = useCallback(
    async (id: string, data: UpdateTodoInput) => {
      setIsLoading(true)
      try {
        await updateTask(id, data)
        await refreshTasks(filter)
        toast.success('タスクを更新しました')
      } catch (error) {
        console.error('Failed to update task:', error)
        toast.error('タスクの更新に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [filter, refreshTasks],
  )

  // 削除
  const deleteTodo = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await deleteTask(id)
        await refreshTasks(filter)
        toast.success('タスクを削除しました')
      } catch (error) {
        console.error('Failed to delete task:', error)
        toast.error('タスクの削除に失敗しました')
      } finally {
        setIsLoading(false)
      }
    },
    [filter, refreshTasks],
  )

  // 完了状態をトグル
  const toggleComplete = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id)
      if (todo) {
        updateTodo(id, { is_completed: !todo.is_completed })
      }
    },
    [todos, updateTodo],
  )

  return {
    todos: sortedTodos,
    isLoading,
    editingTodo,
    setEditingTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    filter,
    setFilter: handleFilterChange,
  }
}
