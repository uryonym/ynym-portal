'use client'

import { useState, useEffect } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Refueling } from '@/generated/client'

import { createRefueling, updateRefueling, deleteRefueling } from '../actions/refuelings'

type RefuelingFormSheetProps = {
  mode: 'create' | 'edit'
  carId: string
  refueling?: Refueling | null
}

const RefuelingFormSheet = ({ mode = 'create', carId, refueling }: RefuelingFormSheetProps) => {
  // mode=createのときだけ内部でopenを管理
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState({
    refuelDatetime: '',
    odometer: '',
    fuelType: '',
    price: '',
    totalCost: '',
    isFull: false,
    gasStand: '',
  })

  useEffect(() => {
    if (mode === 'edit' && refueling) {
      setForm({
        refuelDatetime: new Date(refueling.refuelDatetime).toISOString().slice(0, 16),
        odometer: refueling.odometer.toString(),
        fuelType: refueling.fuelType,
        price: refueling.price.toString(),
        totalCost: refueling.totalCost.toString(),
        isFull: refueling.isFull,
        gasStand: refueling.gasStand,
      })
    } else {
      setForm({
        refuelDatetime: '',
        odometer: '',
        fuelType: '',
        price: '',
        totalCost: '',
        isFull: false,
        gasStand: '',
      })
    }
  }, [mode, refueling, internalOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('isFull', form.isFull ? 'true' : 'false')
    formData.set('carId', carId)
    if (mode === 'edit' && refueling) {
      formData.append('id', refueling.id)
      await updateRefueling(formData)
      setInternalOpen(false)
    } else {
      await createRefueling(formData)
      setInternalOpen(false)
    }
  }

  const handleDelete = async () => {
    if (!refueling) return
    const formData = new FormData()
    formData.append('id', refueling.id)
    await deleteRefueling(formData)
    if (mode === 'edit') return
    setInternalOpen(false)
  }

  return (
    <>
      {mode === 'create' && (
        <button
          className="mb-8 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={() => setInternalOpen(true)}
        >
          給油記録を追加
        </button>
      )}
      {mode === 'edit' && (
        <button
          type="button"
          className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
          onClick={() => setInternalOpen(true)}
        >
          編集
        </button>
      )}
      <Drawer open={internalOpen} onOpenChange={setInternalOpen}>
        <DrawerContent className="mx-auto max-w-xl">
          <DrawerHeader>
            <DrawerTitle>{mode === 'edit' ? '給油記録の編集' : '給油記録の追加'}</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto px-4 pb-4"
          >
            <div>
              <label className="mb-1 block font-medium">
                日付・時刻<span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="refuelDatetime"
                value={form.refuelDatetime}
                onChange={(e) => setForm({ ...form, refuelDatetime: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">走行距離</label>
              <input
                type="number"
                name="odometer"
                value={form.odometer}
                onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">燃料種別</label>
              <input
                type="text"
                name="fuelType"
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">単価</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">合計金額</label>
              <input
                type="number"
                name="totalCost"
                value={form.totalCost}
                onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">満タン</label>
              <input
                type="checkbox"
                name="isFull"
                checked={form.isFull}
                onChange={(e) => setForm({ ...form, isFull: e.target.checked })}
                className="ml-2 h-5 w-5 align-middle"
              />
              <span className="ml-2">満タンの場合はチェック</span>
            </div>
            <div>
              <label className="mb-1 block font-medium">スタンド</label>
              <input
                type="text"
                name="gasStand"
                value={form.gasStand}
                onChange={(e) => setForm({ ...form, gasStand: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
              <button
                type="submit"
                className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                {mode === 'edit' ? '保存' : '追加'}
              </button>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
                >
                  削除
                </button>
              )}
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default RefuelingFormSheet
