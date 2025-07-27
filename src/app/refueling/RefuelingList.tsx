'use client'
import { useState } from 'react'

import { Refueling } from '@/generated/client'

import RefuelingFormSheet from './RefuelingFormSheet'

export default function RefuelingList({
  carId,
  refuelings,
}: {
  carId?: string
  refuelings?: Refueling[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRefueling, setSelectedRefueling] = useState<Refueling>()
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleNewRefuelingClick = () => {
    setSelectedRefueling(undefined)
    setFormMode('create')
    setIsOpen(true)
  }

  const handleEditRefueling = (refueling: Refueling) => {
    setSelectedRefueling(refueling)
    setFormMode('edit')
    setIsOpen(true)
  }

  return (
    <>
      {carId && (
        <div className="mb-4 flex justify-between">
          <button
            className="mb-2 rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            onClick={handleNewRefuelingClick}
          >
            新規給油記録追加
          </button>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-4">
        {(refuelings ?? []).map((refueling) => (
          <div
            key={refueling.id}
            className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-lg font-bold">
                {new Date(refueling.refuelDatetime).toLocaleDateString()}
              </span>
              <button
                className="rounded bg-yellow-400 px-4 py-1 text-sm font-semibold text-white transition-colors hover:bg-yellow-500"
                onClick={() => handleEditRefueling(refueling)}
              >
                編集
              </button>
            </div>
            <div className="text-sm text-gray-600">
              走行距離: <span className="text-gray-900">{refueling.odometer} km</span>
            </div>
            <div className="text-sm text-gray-600">
              燃料種別: <span className="text-gray-900">{refueling.fuelType}</span>
            </div>
            <div className="text-sm text-gray-600">
              単価: <span className="text-gray-900">{refueling.price} 円</span>
            </div>
            <div className="text-sm text-gray-600">
              合計金額: <span className="text-gray-900">{refueling.totalCost} 円</span>
            </div>
            <div className="text-sm text-gray-600">
              満タン: <span className="text-gray-900">{refueling.isFull ? 'はい' : 'いいえ'}</span>
            </div>
            <div className="text-sm text-gray-600">
              スタンド: <span className="text-gray-900">{refueling.gasStand}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              作成日: {new Date(refueling.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <RefuelingFormSheet
        mode={formMode}
        carId={carId ?? ''}
        refueling={selectedRefueling}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
