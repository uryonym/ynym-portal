'use client'

import { useEffect, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { toDatetimeLocalValue, toUtcIsoString } from '@/lib/date'

import {
  FuelRecord,
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
} from '@/lib/types/fuel-record'
import {
  fuelRecordFormSchema,
  type FuelRecordFormValues,
} from '@/lib/validations/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FUEL_TYPES } from '@/lib/constants'

interface FuelRecordFormProps {
  initialData?: FuelRecord | null
  vehicleId: string
  onSubmit: (data: CreateFuelRecordInput | UpdateFuelRecordInput) => void
  onCancel: () => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function FuelRecordForm({
  initialData,
  vehicleId,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: FuelRecordFormProps) {
  const refuelRef = useRef<HTMLInputElement>(null)

  const form = useForm<FuelRecordFormValues>({
    resolver: zodResolver(
      fuelRecordFormSchema,
    ) as Resolver<FuelRecordFormValues>,
    defaultValues: {
      refuel_datetime: toDatetimeLocalValue(initialData?.refuel_datetime),
      total_mileage: initialData?.total_mileage?.toString() ?? '',
      fuel_type: initialData?.fuel_type ?? '',
      unit_price: initialData?.unit_price?.toString() ?? '',
      total_cost: initialData?.total_cost?.toString() ?? '',
      is_full_tank: initialData?.is_full_tank ?? false,
      gas_station_name: initialData?.gas_station_name ?? '',
    },
  })

  // initialData が変わった場合（新規追加・別アイテムの編集など）にフォームをリセット
  useEffect(() => {
    form.reset({
      refuel_datetime: toDatetimeLocalValue(initialData?.refuel_datetime),
      total_mileage: initialData?.total_mileage?.toString() ?? '',
      fuel_type: initialData?.fuel_type ?? '',
      unit_price: initialData?.unit_price?.toString() ?? '',
      total_cost: initialData?.total_cost?.toString() ?? '',
      is_full_tank: initialData?.is_full_tank ?? false,
      gas_station_name: initialData?.gas_station_name ?? '',
    })

    if (initialData && refuelRef.current) {
      setTimeout(() => {
        refuelRef.current?.blur()
      }, 0)
    }
  }, [initialData, form])

  const handleFormSubmit = (values: FuelRecordFormValues) => {
    const data = {
      vehicle_id: vehicleId,
      refuel_datetime: toUtcIsoString(values.refuel_datetime),
      total_mileage: parseInt(values.total_mileage, 10),
      fuel_type: values.fuel_type.trim(),
      unit_price: parseInt(values.unit_price, 10),
      total_cost: parseInt(values.total_cost, 10),
      is_full_tank: values.is_full_tank,
      ...(values.gas_station_name?.trim() && {
        gas_station_name: values.gas_station_name.trim(),
      }),
    }

    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="refuel_datetime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                給油日時 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={(e) => {
                    field.ref(e)
                    refuelRef.current = e
                  }}
                  type="datetime-local"
                  disabled={isLoading}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="total_mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  走行距離 (km) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="例：10000"
                    disabled={isLoading}
                    className="h-10"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  燃料種別 <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-10 w-full bg-white">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FUEL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  単価 (¥) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="例：165"
                    disabled={isLoading}
                    className="h-10"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  合計金額 (¥) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="例：6600"
                    disabled={isLoading}
                    className="h-10"
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gas_station_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ガソリンスタンド名</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="例：ENEOS 東京駅前"
                  disabled={isLoading}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_full_tank"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0 pt-1">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal text-gray-700 cursor-pointer">
                満タン
              </FormLabel>
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
              className="h-10"
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading} className="h-10">
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>

          {initialData && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete(initialData.id)
                onCancel()
              }}
              disabled={isLoading}
              className="w-full h-10 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              この記録を削除
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
