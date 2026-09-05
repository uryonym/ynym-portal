import { ApiResponse } from './api'

export interface Todo {
  id: string
  user_id: string
  title: string
  description: string | null
  is_completed: boolean
  completed_at: string | null
  due_date: string | null
  order: number
  created_at: string
  updated_at: string
}

export type TodosResponse = ApiResponse<Todo[]>
export type TodoResponse = ApiResponse<Todo>

export interface CreateTodoInput {
  title: string
  description?: string | null
  due_date?: string | null
}

export interface UpdateTodoInput {
  title?: string
  description?: string | null
  is_completed?: boolean
  due_date?: string | null
}
