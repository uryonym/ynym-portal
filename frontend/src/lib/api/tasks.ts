import {
  TasksResponse,
  TaskResponse,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/lib/types/task'
import { apiClient } from './client'

export type TaskFilter = 'all' | 'active' | 'completed'

export async function fetchTasks(
  filter: TaskFilter = 'active',
): Promise<TasksResponse> {
  const params = new URLSearchParams()
  if (filter === 'active') {
    params.set('is_completed', 'false')
  } else if (filter === 'completed') {
    params.set('is_completed', 'true')
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
