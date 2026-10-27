import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().default(''),
  due_date: z.string().default(''),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

