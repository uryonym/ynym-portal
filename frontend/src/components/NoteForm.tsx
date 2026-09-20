'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import type { Note } from '@/lib/types/note'
import type { NoteCategory } from '@/lib/types/note-category'
import { noteFormSchema } from '@/lib/validations/note'
import type { NoteFormValues } from '@/lib/validations/note'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface NoteFormProps {
  initialData?: Note | null
  categories: NoteCategory[]
  onSubmit: (data: NoteFormValues) => void
  onCancel: () => void
  onDelete?: (note: Note) => void
  isLoading?: boolean
}
const NONE_CATEGORY_VALUE = '__none__'
export function NoteForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: NoteFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const categoryItems = useMemo(() => {
    const items: Record<string, string> = {
      [NONE_CATEGORY_VALUE]: '未分類（なし）',
    }
    categories.forEach((c) => {
      items[c.id] = c.name
    })
    return items
  }, [categories])
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema) as Resolver<NoteFormValues>,
    defaultValues: {
      title: initialData?.title ?? '',
      body: initialData?.body ?? '',
      category_id: initialData?.category_id ?? '',
    },
  })
  useEffect(() => {
    form.reset({
      title: initialData?.title ?? '',
      body: initialData?.body ?? '',
      category_id: initialData?.category_id ?? '',
    })
    if (initialData && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 0)
    }
  }, [initialData, form])
  const handleFormSubmit = (values: NoteFormValues) => {
    const categoryId =
      values.category_id === NONE_CATEGORY_VALUE || !values.category_id
        ? ''
        : values.category_id
    onSubmit({
      title: values.title.trim(),
      body: values.body.trim(),
      category_id: categoryId,
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
                  placeholder="ノートのタイトル"
                  disabled={isLoading}
                  maxLength={255}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select
                items={categoryItems}
                onValueChange={(val) =>
                  field.onChange(val === NONE_CATEGORY_VALUE ? '' : val)
                }
                value={field.value ? field.value : NONE_CATEGORY_VALUE}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="h-10 w-full bg-white">
                    <SelectValue placeholder="カテゴリを選択（任意）" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE_CATEGORY_VALUE}>
                    未分類（なし）
                  </SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                本文 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="ノートの本文を入力してください"
                  disabled={isLoading}
                  rows={8}
                  className="min-h-[160px] resize-y"
                />
              </FormControl>
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
              className="h-10 cursor-pointer"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 cursor-pointer"
            >
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>

          {initialData && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(initialData)}
              disabled={isLoading}
              className="w-full h-10 gap-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              このノートを削除
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
