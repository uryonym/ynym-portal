import { z } from 'zod'

export const userFormSchema = z.object({
  google_uid: z.string().trim().min(1, 'Google UID は必須です'),
  name: z.string().trim().min(1, '名前を入力してください'),
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスの形式で入力してください'),
  is_admin: z.boolean().default(false),
})

export type UserFormValues = z.infer<typeof userFormSchema>

