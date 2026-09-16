'use client'

import { TaskDialog, type TaskDialogProps } from './TaskDialog'

/** @deprecated Use `TaskDialogProps` instead. */
export type TodoDialogProps = TaskDialogProps

/** @deprecated Use `TaskDialog` instead. */
export function TodoDialog(props: TaskDialogProps) {
  return <TaskDialog {...props} />
}
