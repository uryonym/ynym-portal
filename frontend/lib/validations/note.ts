import { z } from 'zod'

export const noteFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'タイトルを入力してください')
    .max(255, 'タイトルは255文字以内で入力してください'),
  body: z.string().trim().min(1, '本文を入力してください'),
  category_id: z.string().default(''),
})

export type NoteFormValues = z.infer<typeof noteFormSchema>
