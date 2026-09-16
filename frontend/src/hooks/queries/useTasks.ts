import { useState, useCallback } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from '@tanstack/react-query'
import {
  fetchTasks,
  createTask as createTaskAPI,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
  TaskFilter,
} from '@/lib/api/tasks'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task'
import { toast } from 'sonner'

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filter: TaskFilter) => [...taskKeys.lists(), { filter }] as const,
}

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
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

export const taskQueries = {
  list: (filter: TaskFilter) =>
    queryOptions({
      queryKey: taskKeys.list(filter),
      queryFn: async () => {
        const response = await fetchTasks(filter)
        return sortTasks(response.data)
      },
    }),
}

export function useTasksQuery(filter: TaskFilter = 'active') {
  return useQuery(taskQueries.list(filter))
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTaskAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('タスクを作成しました')
    },
    onError: (error) => {
      console.error('Failed to create task:', error)
      toast.error('タスクの作成に失敗しました')
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      updateTaskAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('タスクを更新しました')
    },
    onError: (error) => {
      console.error('Failed to update task:', error)
      toast.error('タスクの更新に失敗しました')
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTaskAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('タスクを削除しました')
    },
    onError: (error) => {
      console.error('Failed to delete task:', error)
      toast.error('タスクの削除に失敗しました')
    },
  })
}

/**
 * 既存コンポーネント向けの互換カスタムフック
 */
export function useTasks(initialFilter: TaskFilter = 'active') {
  const [filter, setFilter] = useState<TaskFilter>(initialFilter)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { data: tasks = [], isLoading } = useTasksQuery(filter)
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const deleteMutation = useDeleteTaskMutation()

  const addTask = useCallback(
    async (data: CreateTaskInput) => {
      await createMutation.mutateAsync(data)
    },
    [createMutation],
  )

  const updateTask = useCallback(
    async (id: string, data: UpdateTaskInput) => {
      await updateMutation.mutateAsync({ id, data })
    },
    [updateMutation],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id)
    },
    [deleteMutation],
  )

  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id)
      if (task) {
        await updateMutation.mutateAsync({
          id,
          data: { is_completed: !task.is_completed },
        })
      }
    },
    [tasks, updateMutation],
  )

  return {
    tasks,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filter,
    setFilter,
    // 互換用エイリアス
    todos: tasks,
    editingTodo: editingTask,
    setEditingTodo: setEditingTask,
    addTodo: addTask,
    updateTodo: updateTask,
    deleteTodo: deleteTask,
  }
}
