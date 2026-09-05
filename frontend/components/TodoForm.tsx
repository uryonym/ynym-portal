'use client'

import { useEffect, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Trash2, Calendar as CalendarIcon, X } from 'lucide-react'
import { parseDateString, formatDisplayDate } from '@/lib/date'

import { Todo, CreateTodoInput, UpdateTodoInput } from '@/lib/types/todo'
import { todoFormSchema, type TodoFormValues } from '@/lib/validations/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface TodoFormProps {
  initialData?: Todo | null
  onSubmit: (data: CreateTodoInput | UpdateTodoInput) => void
  onCancel: () => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function TodoForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: TodoFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema) as Resolver<TodoFormValues>,
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

  const handleFormSubmit = (values: TodoFormValues) => {
    onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() || null,
      due_date: values.due_date || null,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                タイトル <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={(e) => {
                    field.ref(e)
                    titleInputRef.current = e
                  }}
                  placeholder="タスクのタイトルを入力"
                  disabled={isLoading}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="タスクの詳細説明（任意）"
                  disabled={isLoading}
                  className="min-h-24 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>期日</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? formatDisplayDate(
                            parseDateString(field.value, 'yyyy-MM-dd'),
                          )
                        : '期日を選択'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
                      <div className="border-t p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full gap-2 text-gray-600 hover:text-red-600"
                          onClick={() => field.onChange('')}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
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

        <div className="space-y-3 pt-4">
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="h-10"
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading} className="h-10">
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>

          {initialData && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete(initialData.id)
                onCancel()
              }}
              disabled={isLoading}
              className="w-full h-10 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              このタスクを削除
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
