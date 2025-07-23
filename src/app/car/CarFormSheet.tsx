'use client'

import { useState, useEffect } from 'react'

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Car } from '@/generated/client'

import { createCar, updateCar, deleteCar } from '../actions/cars'

type CarFormSheetProps = {
  mode?: 'create' | 'edit'
  car?: Car | null
}

const CarFormSheet = ({ mode = 'create', car }: CarFormSheetProps) => {
  // mode=createのときだけ内部でopenを管理
  const [internalOpen, setInternalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    seq: '',
    maker: '',
    model: '',
    modelYear: '',
    licensePlate: '',
    tankCapacity: '',
  })

  useEffect(() => {
    if (mode === 'edit' && car) {
      setForm({
        name: car.name,
        seq: car.seq.toString(),
        maker: car.maker,
        model: car.model,
        modelYear: car.modelYear.toString(),
        licensePlate: car.licensePlate,
        tankCapacity: car.tankCapacity.toString(),
      })
    } else {
      setForm({
        name: '',
        seq: '',
        maker: '',
        model: '',
        modelYear: '',
        licensePlate: '',
        tankCapacity: '',
      })
    }
  }, [mode, car, internalOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (mode === 'edit' && car) {
      formData.append('id', car.id)
      await updateCar(formData)
      setInternalOpen(false)
    } else {
      await createCar(formData)
      setInternalOpen(false)
    }
  }

  const handleDelete = async () => {
    if (!car) return
    const formData = new FormData()
    formData.append('id', car.id)
    await deleteCar(formData)
    if (mode === 'edit') return
    setInternalOpen(false)
  }

  return (
    <>
      {mode === 'create' && (
        <button
          className="mb-2 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={() => setInternalOpen(true)}
        >
          車両を追加
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
            <DrawerTitle>{mode === 'edit' ? '車両編集' : '車両追加'}</DrawerTitle>
          </DrawerHeader>
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto px-4 pb-4"
          >
            <div>
              <label className="mb-1 block font-medium">
                車名
                <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="車名"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">管理番号</label>
              <input
                name="seq"
                value={form.seq}
                onChange={(e) => setForm({ ...form, seq: e.target.value })}
                placeholder="管理番号"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">メーカー</label>
              <input
                name="maker"
                value={form.maker}
                onChange={(e) => setForm({ ...form, maker: e.target.value })}
                placeholder="メーカー"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">型式</label>
              <input
                name="model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="型式"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">年式</label>
              <input
                name="modelYear"
                value={form.modelYear}
                onChange={(e) => setForm({ ...form, modelYear: e.target.value })}
                placeholder="年式"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">ナンバー</label>
              <input
                name="licensePlate"
                value={form.licensePlate}
                onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                placeholder="ナンバー"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium">タンク容量</label>
              <input
                name="tankCapacity"
                value={form.tankCapacity}
                onChange={(e) => setForm({ ...form, tankCapacity: e.target.value })}
                placeholder="タンク容量"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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

export default CarFormSheet
