import React from 'react'

import RefuelingFormSheet from './RefuelingFormSheet'
import { getCars } from '../actions/cars'
import { getRefuelings } from '../actions/refuelings'

export default async function Refueling() {
  const { cars, error: carsError } = await getCars()
  const { refuelings, error: refuelingsError } = await getRefuelings()

  if (carsError || refuelingsError) {
    return <div className="p-6 text-red-500">Error: {carsError ?? refuelingsError}</div>
  }

  return (
    <div className="p-4">
      <p className="mb-4 text-xl font-bold">給油記録ページ</p>
      <div className="mb-4">
        <select className="rounded border border-gray-300 px-3 py-2" defaultValue="">
          <option value="" disabled>
            車両を選択
          </option>
          {(cars ?? []).map((car) => (
            <option key={car.id} value={car.id}>
              {car.name}
            </option>
          ))}
        </select>
      </div>
      <RefuelingFormSheet mode="create" />
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
              <RefuelingFormSheet mode="edit" refueling={refueling} />
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
    </div>
  )
}
