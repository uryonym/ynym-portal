'use client'

import { useState, useEffect } from 'react'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Refueling } from '@/generated/client'

import { createRefueling, updateRefueling, deleteRefueling } from '../actions/refuelings'

type RefuelingFormSheetProps = {
  mode?: 'create' | 'edit'
  refueling?: Refueling | null
}

const RefuelingFormSheet = ({ mode = 'create', refueling }: RefuelingFormSheetProps) => {
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

  // create時はボタンでopen、edit時はpropsでopen制御
  const open = mode === 'edit' ? undefined : internalOpen
  const onOpenChange = mode === 'edit' ? undefined : setInternalOpen

  return (
    <>
      {mode === 'create' && (
        <button
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => setInternalOpen(true)}
        >
          給油記録を追加
        </button>
      )}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetHeader>
          <SheetTitle>{mode === 'edit' ? '給油記録の編集' : '給油記録の追加'}</SheetTitle>
        </SheetHeader>
        <SheetContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">日付・時刻</label>
              <input
                type="datetime-local"
                name="refuelDatetime"
                value={form.refuelDatetime}
                onChange={(e) => setForm({ ...form, refuelDatetime: e.target.value })}
                className="w-full rounded border px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">走行距離</label>
              <input
                type="number"
                name="odometer"
                value={form.odometer}
                onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                className="w-full rounded border px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">燃料種別</label>
              <input
                type="text"
                name="fuelType"
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                className="w-full rounded border px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">単価</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded border px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">合計金額</label>
              <input
                type="number"
                name="totalCost"
                value={form.totalCost}
                onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
                className="w-full rounded border px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">満タン</label>
              <input
                type="checkbox"
                name="isFull"
                checked={form.isFull}
                onChange={(e) => setForm({ ...form, isFull: e.target.checked })}
                className="ml-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">スタンド</label>
              <input
                type="text"
                name="gasStand"
                value={form.gasStand}
                onChange={(e) => setForm({ ...form, gasStand: e.target.value })}
                className="w-full rounded border px-2 py-1"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
                {mode === 'edit' ? '更新' : '追加'}
              </button>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  削除
                </button>
              )}
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default RefuelingFormSheet
