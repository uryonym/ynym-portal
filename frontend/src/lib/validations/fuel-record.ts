import { z } from 'zod'

import { FUEL_TYPES } from '@/lib/constants'

// 0以上の整数を検証するヘルパー
const nonNegativeIntegerSchema = (emptyMessage: string) =>
  z
    .string()
    .min(1, emptyMessage)
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && Number.isInteger(num) && num >= 0
    }, '0以上の整数を入力してください')

export const fuelRecordFormSchema = z.object({
  refuel_datetime: z.string().min(1, '給油日時を入力してください'),
  total_mileage: nonNegativeIntegerSchema('走行距離を入力してください'),
  fuel_type: z
    .string()
    .min(1, '燃料種別を選択してください')
    .refine(
      (val) => (FUEL_TYPES as readonly string[]).includes(val),
      '有効な燃料種別を選択してください',
    ),
  unit_price: nonNegativeIntegerSchema('単価を入力してください'),
  total_cost: nonNegativeIntegerSchema('合計金額を入力してください'),
  is_full_tank: z.boolean().default(false),
  gas_station_name: z.string().default(''),
})

export type FuelRecordFormValues = z.infer<typeof fuelRecordFormSchema>
