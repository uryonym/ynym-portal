'use client'

import { useState, useEffect } from 'react'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Task } from '@/generated/client'

import { createTask, updateTask, deleteTask } from '../actions/tasks'

type TaskFormSheetProps = {
  mode?: 'create' | 'edit'
  task?: Task | null
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const TaskFormSheet = ({
  mode = 'create',
  task,
  onSuccess,
  open,
  onOpenChange,
}: TaskFormSheetProps) => {
  // mode=createのときだけ内部でopenを管理
  const [internalOpen, setInternalOpen] = useState(false)

  const isOpen = mode === 'edit' ? open : internalOpen
  const setIsOpen = mode === 'edit' ? onOpenChange : setInternalOpen

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  })

  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
        completed: task.completed,
      })
    } else {
      setForm({ title: '', description: '', dueDate: '', completed: false })
    }
  }, [mode, task, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (mode === 'edit' && task) {
      await updateTask({
        id: task.id,
        title: form.title,
        description: form.description,
        completed: form.completed,
      })
    } else {
      await createTask({
        title: form.title,
        description: form.description,
      })
    }
    setIsOpen?.(false)
    onSuccess?.()
  }

  const handleDelete = async () => {
    if (!task) return
    await deleteTask(task.id)
    setIsOpen?.(false)
    onSuccess?.()
  }

  return (
    <>
      {mode === 'create' && (
        <button
          className="mb-2 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={() => setIsOpen?.(true)}
        >
          新規タスク追加
        </button>
      )}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-xl">
          <SheetHeader>
            <SheetTitle>{mode === 'edit' ? 'タスク編集' : '新規タスク追加'}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-4">
            <div>
              <label className="mb-1 block font-medium">
                タイトル<span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">説明</label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">期限</label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {mode === 'edit' && (
              <div>
                <label className="mb-1 block font-medium">完了</label>
                <input
                  name="completed"
                  type="checkbox"
                  checked={form.completed}
                  onChange={(e) => setForm((f) => ({ ...f, completed: e.target.checked }))}
                  className="h-5 w-5 align-middle"
                />
                <span className="ml-2">完了した場合はチェック</span>
              </div>
            )}
            <div className="mt-2 flex w-full items-center justify-between">
              <button
                type="submit"
                className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                {mode === 'edit' ? '保存' : '追加'}
              </button>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
                >
                  削除
                </button>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default TaskFormSheet
