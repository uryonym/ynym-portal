import { z } from 'zod'
import {
  FUEL_TYPES,
  VEHICLE_YEAR_MIN,
  VEHICLE_YEAR_MAX,
} from '@/lib/constants'

// 0以上の整数を検証するヘルパー
const nonNegativeIntegerSchema = (emptyMessage: string) =>
  z
    .string()
    .min(1, emptyMessage)
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && Number.isInteger(num) && num >= 0
    }, '0以上の整数を入力してください')

export const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'タイトルを入力してください')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().default(''),
  due_date: z.string().default(''),
})

export type TodoFormValues = z.infer<typeof todoFormSchema>

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
