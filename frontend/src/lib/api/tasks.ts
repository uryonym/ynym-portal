import { apiClient } from './client'

import type {
  TasksResponse,
  TaskResponse,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/lib/types/task'

export type TaskFilter = 'all' | 'active' | 'completed'

export interface FetchTasksOptions {
  filter?: TaskFilter
  due_from?: string
  due_to?: string
}

export async function fetchTasks(
  optionsOrFilter: TaskFilter | FetchTasksOptions = 'active',
): Promise<TasksResponse> {
  const options: FetchTasksOptions =
    typeof optionsOrFilter === 'string'
      ? { filter: optionsOrFilter }
      : optionsOrFilter

  const params = new URLSearchParams()
  if (options.filter === 'active') {
    params.set('is_completed', 'false')
  } else if (options.filter === 'completed') {
    params.set('is_completed', 'true')
  }
  if (options.due_from) {
    params.set('due_from', options.due_from)
  }
  if (options.due_to) {
    params.set('due_to', options.due_to)
  }

  const query = params.toString() ? `?${params.toString()}` : ''
  return apiClient.get<TasksResponse>(`/api/tasks${query}`)
}
export async function createTask(
  input: CreateTaskInput,
): Promise<TaskResponse> {
  return apiClient.post<TaskResponse>('/api/tasks', input)
}
export async function updateTask(
  id: string,
  input: UpdateTaskInput,
): Promise<TaskResponse> {
  return apiClient.put<TaskResponse>(`/api/tasks/${id}`, input)
}
export async function deleteTask(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/tasks/${id}`)
}
