import { z } from 'zod'

export const noteCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'カテゴリ名を入力してください')
    .max(255, 'カテゴリ名は255文字以内で入力してください'),
})

export type NoteCategoryFormValues = z.infer<typeof noteCategoryFormSchema>
