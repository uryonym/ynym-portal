import { useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { Trash2, Calendar as CalendarIcon, X } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { parseDateString, formatDisplayDate } from '@/lib/date'
import { taskFormSchema } from '@/lib/validations/schemas'

import type { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/types/task'
import type { TaskFormValues } from '@/lib/validations/schemas'
import type { Resolver } from 'react-hook-form'

export interface TaskFormProps {
  initialData?: Task | null
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void
  onCancel: () => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: TaskFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const isEditing = Boolean(initialData)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema) as Resolver<TaskFormValues>,
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      due_date: initialData?.due_date ?? '',
    },
  })

  // initialData が変わった場合（新規追加・別アイテムの編集など）にフォームをリセット
  useEffect(() => {
    form.reset({
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      due_date: initialData?.due_date ?? '',
    })
    if (initialData && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.blur()
      }, 0)
    }
  }, [initialData, form])

  const handleFormSubmit = (values: TaskFormValues) => {
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || null,
      due_date: values.due_date || null,
    })
  }

  const setQuickDate = (daysToAdd: number) => {
    const target = addDays(new Date(), daysToAdd)
    form.setValue('due_date', format(target, 'yyyy-MM-dd'), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const clearDate = () => {
    form.setValue('due_date', '', {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const currentDateValue = useWatch({
    control: form.control,
    name: 'due_date',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {/* タイトル */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  タイトル <span className="text-rose-500">*</span>
                </FormLabel>
              </div>
              <FormControl>
                <Input
                  {...field}
                  ref={(e) => {
                    field.ref(e)
                    titleInputRef.current = e
                  }}
                  placeholder="タスクのタイトルを入力（例: 経費精算を提出する）"
                  disabled={isLoading}
                  className="h-10 text-sm rounded-xl border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 説明（メモ） */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  詳細メモ
                </FormLabel>
                <span className="text-[11px] text-slate-400">任意</span>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value}
                  placeholder="詳細な補足情報やリンクなどがあれば入力してください"
                  disabled={isLoading}
                  className="min-h-24 text-sm leading-relaxed rounded-xl border-slate-200 placeholder:text-slate-400 resize-none p-3 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 期日 */}
        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold text-slate-700">
                  期日
                </FormLabel>
                <span className="text-[11px] text-slate-400">任意</span>
              </div>

              {/* クイック選択ショートカット */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  今日
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  明日
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  1週間後
                </button>
                {currentDateValue && (
                  <button
                    type="button"
                    onClick={clearDate}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50/60 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    クリア
                  </button>
                )}
              </div>

              <Popover>
                <FormControl>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10 rounded-xl border-slate-200 hover:bg-slate-50/80 text-sm cursor-pointer"
                        disabled={isLoading}
                      />
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {field.value ? (
                      <span className="text-slate-900 font-medium">
                        {formatDisplayDate(
                          parseDateString(field.value, 'yyyy-MM-dd'),
                          'yyyy年M月d日(E)',
                        )}
                      </span>
                    ) : (
                      <span className="text-slate-400">カレンダーから指定</span>
                    )}
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <div className="flex flex-col">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? parseDateString(field.value, 'yyyy-MM-dd')
                          : undefined
                      }
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                      }}
                      disabled={isLoading}
                    />
                    {field.value && (
                      <div className="border-t border-slate-100 p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full gap-2 text-xs text-slate-600 hover:text-rose-600 cursor-pointer"
                          onClick={() => field.onChange('')}
                          disabled={isLoading}
                        >
                          <X className="h-3.5 w-3.5" />
                          期日をクリア
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ボタンフッター */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-150 gap-2">
          <div>
            {isEditing && initialData && onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(initialData.id)
                  onCancel()
                }}
                disabled={isLoading}
                className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 h-9 px-2.5 gap-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>タスクを削除</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isLoading}
              className="h-9 px-4 text-xs sm:text-sm rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-9 px-4 text-xs sm:text-sm rounded-xl bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs font-medium"
            >
              {isLoading
                ? '保存中...'
                : isEditing
                  ? '変更を保存'
                  : 'タスクを作成'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
