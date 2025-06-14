'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { createTask } from '../actions/tasks'

const TaskFromSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="mb-8 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700">
          新規タスク追加
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-xl">
        <form action={createTask} className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1 block font-medium">
              タイトル<span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">説明</label>
            <textarea
              name="description"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">期限</label>
            <input
              name="dueDate"
              type="date"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          >
            追加
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default TaskFromSheet
