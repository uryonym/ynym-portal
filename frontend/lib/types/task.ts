import type { components } from './generated/schema'

export type Task = components['schemas']['TaskResponse']
export type CreateTaskInput = components['schemas']['TaskCreate']
export type UpdateTaskInput = components['schemas']['TaskUpdate']
export type TaskResponse =
  components['schemas']['SuccessResponse_TaskResponse_']
export type TasksResponse =
  components['schemas']['SuccessResponse_list_TaskResponse__']

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
