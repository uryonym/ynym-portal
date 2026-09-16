'use client'

import { useEffect, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'

import {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'
import {
  vehicleFormSchema,
  type VehicleFormValues,
} from '@/lib/validations/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface VehicleFormProps {
  initialData?: Vehicle | null
  onSubmit: (data: CreateVehicleInput | UpdateVehicleInput) => void
  onCancel: () => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function VehicleForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  isLoading = false,
}: VehicleFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema) as Resolver<VehicleFormValues>,
    defaultValues: {
      name: initialData?.name ?? '',
      maker: initialData?.maker ?? '',
      model: initialData?.model ?? '',
      year: initialData?.year?.toString() ?? '',
      number: initialData?.number ?? '',
      tank_capacity: initialData?.tank_capacity?.toString() ?? '',
    },
  })

  // initialData が変わった場合（新規追加・別アイテムの編集など）にフォームをリセット
  useEffect(() => {
    form.reset({
      name: initialData?.name ?? '',
      maker: initialData?.maker ?? '',
      model: initialData?.model ?? '',
      year: initialData?.year?.toString() ?? '',
      number: initialData?.number ?? '',
      tank_capacity: initialData?.tank_capacity?.toString() ?? '',
    })

    if (initialData && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.blur()
      }, 0)
    }
  }, [initialData, form])

  const handleFormSubmit = (values: VehicleFormValues) => {
    const data: CreateVehicleInput = {
      name: values.name.trim(),
      maker: values.maker.trim(),
      model: values.model.trim(),
      year: parseInt(values.year, 10),
      number: values.number.trim(),
      ...(values.tank_capacity && {
        tank_capacity: parseFloat(values.tank_capacity),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                車の名前 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={(e) => {
                    field.ref(e)
                    nameInputRef.current = e
                  }}
                  placeholder="例：マイカー1"
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
            name="maker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  メーカー <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="例：Toyota"
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  モデル <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="例：Prius"
                    disabled={isLoading}
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  年式 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="例：2023"
                    disabled={isLoading}
                    className="h-10"
                    min="1900"
                    max="2100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tank_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タンク容量 (L)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="例：50"
                    disabled={isLoading}
                    className="h-10"
                    min="1"
                    step="0.1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ナンバープレート <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="例：東京 123あ 1234"
                  disabled={isLoading}
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
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
              この車両を削除
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
