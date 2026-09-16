'use client'

import { TaskForm, type TaskFormProps } from './TaskForm'

/** @deprecated Use `TaskFormProps` instead. */
export type TodoFormProps = TaskFormProps

/** @deprecated Use `TaskForm` instead. */
export function TodoForm(props: TaskFormProps) {
  return <TaskForm {...props} />
}
