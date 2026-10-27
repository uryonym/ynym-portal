import { z } from 'zod'

import { VEHICLE_YEAR_MIN, VEHICLE_YEAR_MAX } from '@/lib/constants'

export const vehicleFormSchema = z.object({
  name: z.string().trim().min(1, '車の名前を入力してください'),
  maker: z.string().trim().min(1, 'メーカーを入力してください'),
  model: z.string().trim().min(1, 'モデルを入力してください'),
  year: z
    .string()
    .min(1, '年式を入力してください')
    .refine((val) => {
      const num = Number(val)
      return (
        !isNaN(num) &&
        Number.isInteger(num) &&
        num >= VEHICLE_YEAR_MIN &&
        num <= VEHICLE_YEAR_MAX
      )
    }, `${VEHICLE_YEAR_MIN}〜${VEHICLE_YEAR_MAX}の整数で入力してください`),
  number: z.string().trim().min(1, 'ナンバープレートを入力してください'),
  tank_capacity: z
    .string()
    .default('')
    .refine((val) => {
      if (!val) return true
      const num = Number(val)
      return !isNaN(num) && num > 0
    }, '正の数値を入力してください'),
})

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>

