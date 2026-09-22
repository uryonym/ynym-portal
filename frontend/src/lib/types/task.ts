import type { SuccessResponse } from './api'

export interface Task {
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
  deleted_at?: string | null
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  due_date?: string | null
  is_completed?: boolean | null
}

export interface UpdateTaskInput {
  title?: string | null
  description?: string | null
  due_date?: string | null
  is_completed?: boolean | null
}

export type TaskResponse = SuccessResponse<Task>
export type TasksResponse = SuccessResponse<Task[]>

// 後方互換・移行用エイリアス
/** @deprecated Use `Task` instead. */
export type Todo = Task
/** @deprecated Use `CreateTaskInput` instead. */
export type CreateTodoInput = CreateTaskInput
/** @deprecated Use `UpdateTaskInput` instead. */
export type UpdateTodoInput = UpdateTaskInput
/** @deprecated Use `TaskResponse` instead. */
export type TodoResponse = TaskResponse
/** @deprecated Use `TasksResponse` instead. */
export type TodosResponse = TasksResponse
