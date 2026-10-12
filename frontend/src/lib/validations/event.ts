import { z } from 'zod'

export const eventFormSchema = z
  .object({
    title: z
      .string()
      .min(1, 'タイトルを入力してください')
      .max(255, 'タイトルは255文字以内で入力してください')
      .transform((val) => val.trim()),
    is_all_day: z.boolean(),
    start_date: z.string().min(1, '開始日を選択してください'),
    start_time: z.string(),
    end_date: z.string().min(1, '終了日を選択してください'),
    end_time: z.string(),
    is_private: z.boolean(),
    participant_ids: z.array(z.string()),
    location: z
      .string()
      .max(255, '場所は255文字以内で入力してください')
      .optional()
      .or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.is_all_day) {
        return data.start_date <= data.end_date
      }
      const start = new Date(`${data.start_date}T${data.start_time || '00:00'}`)
      const end = new Date(`${data.end_date}T${data.end_time || '00:00'}`)
      return end > start
    },
    {
      message: '終了日時は開始日時より後である必要があります',
      path: ['end_time'],
    },
  )

export type EventFormValues = z.infer<typeof eventFormSchema>
