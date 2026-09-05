import {
  TodosResponse,
  TodoResponse,
  CreateTodoInput,
  UpdateTodoInput,
} from '@/lib/types/todo'
import { apiClient } from './client'

export type TaskFilter = 'all' | 'active' | 'completed'

export async function fetchTasks(
  filter: TaskFilter = 'active',
): Promise<TodosResponse> {
  const params = new URLSearchParams()
  if (filter === 'active') {
    params.set('is_completed', 'false')
  } else if (filter === 'completed') {
    params.set('is_completed', 'true')
  }

  const query = params.toString() ? `?${params.toString()}` : ''
  return apiClient.get<TodosResponse>(`/api/tasks${query}`)
}

export async function createTask(
  input: CreateTodoInput,
): Promise<TodoResponse> {
  return apiClient.post<TodoResponse>('/api/tasks', input)
}

export async function updateTask(
  id: string,
  input: UpdateTodoInput,
): Promise<TodoResponse> {
  return apiClient.put<TodoResponse>(`/api/tasks/${id}`, input)
}

export async function deleteTask(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/tasks/${id}`)
}
