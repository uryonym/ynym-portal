import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { userFormSchema } from '@/lib/validations/user'

import type { User, UserCreate, UserUpdate } from '@/lib/types/user'
import type { UserFormValues } from '@/lib/validations/user'
import type { Resolver } from 'react-hook-form'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: User | null
  onSubmit: (data: UserCreate | UserUpdate) => Promise<boolean>
  isLoading?: boolean
}

interface UserFormProps {
  initialData?: User | null
  onSubmit: (data: UserCreate | UserUpdate) => Promise<boolean>
  onClose: () => void
  isLoading: boolean
}

function UserFormContent({
  initialData,
  onSubmit,
  onClose,
  isLoading,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema) as Resolver<UserFormValues>,
    defaultValues: {
      google_uid: initialData?.google_uid ?? '',
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      is_admin: initialData?.is_admin ?? false,
    },
  })

  useEffect(() => {
    form.reset({
      google_uid: initialData?.google_uid ?? '',
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      is_admin: initialData?.is_admin ?? false,
    })
  }, [initialData, form])

  const handleSubmit = async (values: UserFormValues) => {
    const success = await onSubmit({
      google_uid: values.google_uid,
      name: values.name,
      email: values.email,
      is_admin: values.is_admin,
    })
    if (success) {
      onClose()
    }
  }

  const isEdit = !!initialData

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-2"
      >
        <FormField
          control={form.control}
          name="google_uid"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-slate-700">
                Google UID (sub) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="例: 118234857291029384756"
                  disabled={isLoading}
                  className="h-10 text-sm rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-[11px] text-slate-400">
                Googleアカウントの固有ID（OpenID
                Connectのsub値）を入力してください。
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-slate-700">
                名前 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="例: 山田 太郎"
                  disabled={isLoading}
                  className="h-10 text-sm rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-slate-700">
                メールアドレス <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="例: user@example.com"
                  disabled={isLoading}
                  className="h-10 text-sm rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_admin"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 pt-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                管理者権限を付与する
              </FormLabel>
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4 flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 rounded-xl"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isLoading ? '保存中...' : isEdit ? '更新する' : '事前登録する'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export function UserDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
}: UserDialogProps) {
  const isEdit = !!initialData
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'ユーザー情報を編集' : 'ユーザーを事前登録'}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <UserFormContent
            key={initialData?.id ?? 'new'}
            initialData={initialData}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
