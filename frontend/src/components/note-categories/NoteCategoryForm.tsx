import { useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { noteCategoryFormSchema } from '@/lib/validations/note-category'

import type { NoteCategory } from '@/lib/types/note-category'
import type { NoteCategoryFormValues } from '@/lib/validations/note-category'
import type { Resolver } from 'react-hook-form'

interface NoteCategoryFormProps {
  initialData?: NoteCategory | null
  onSubmit: (data: NoteCategoryFormValues) => void
  onCancel: () => void
  onDelete?: (category: NoteCategory) => void
  isLoading?: boolean
}
export function NoteCategoryForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: NoteCategoryFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const form = useForm<NoteCategoryFormValues>({
    resolver: zodResolver(
      noteCategoryFormSchema,
    ) as Resolver<NoteCategoryFormValues>,
    defaultValues: {
      name: initialData?.name ?? '',
    },
  })
  useEffect(() => {
    form.reset({
      name: initialData?.name ?? '',
    })
    if (initialData && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 0)
    }
  }, [initialData, form])
  const handleFormSubmit = (values: NoteCategoryFormValues) => {
    onSubmit({
      name: values.name.trim(),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                カテゴリ名 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={(e) => {
                    field.ref(e)
                    nameInputRef.current = e
                  }}
                  placeholder="例：仕事、趣味、買い物"
                  disabled={isLoading}
                  maxLength={255}
                  className="h-10"
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
              このカテゴリを削除
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
