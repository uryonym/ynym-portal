import React from 'react'

import CarFormSheet from './CarFormSheet'
import { getCars } from '../actions/cars'

export default async function Car() {
  const { cars, error } = await getCars()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-4">
      <p className="mb-4 text-xl font-bold">車両一覧ページ</p>
      <CarFormSheet mode="create" />
      <div className="mt-4 flex flex-col gap-4">
        {(cars ?? []).map((car) => (
          <div
            key={car.id}
            className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-lg font-bold">{car.name}</span>
              <CarFormSheet mode="edit" car={car} />
            </div>
            <div className="text-sm text-gray-600">
              メーカー: <span className="text-gray-900">{car.maker}</span>
            </div>
            <div className="text-sm text-gray-600">
              型式: <span className="text-gray-900">{car.model}</span>
            </div>
            <div className="text-sm text-gray-600">
              年式: <span className="text-gray-900">{car.modelYear}</span>
            </div>
            <div className="text-sm text-gray-600">
              ナンバー: <span className="text-gray-900">{car.licensePlate}</span>
            </div>
            <div className="text-sm text-gray-600">
              タンク容量: <span className="text-gray-900">{car.tankCapacity}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              作成日: {new Date(car.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
