import React from 'react'

import CarFormSheet from './CarFormSheet'
import CarTable from './CarTable'
import { getCars } from '../actions/cars'

export default async function Car() {
  const { cars, error } = await getCars()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-bold">車両一覧ページ</p>
      <CarFormSheet mode="create" />
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">車名</th>
              <th className="border border-gray-300 px-4 py-2 text-left">メーカー</th>
              <th className="border border-gray-300 px-4 py-2 text-left">型式</th>
              <th className="border border-gray-300 px-4 py-2 text-left">年式</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ナンバー</th>
              <th className="border border-gray-300 px-4 py-2 text-left">タンク容量</th>
              <th className="border border-gray-300 px-4 py-2 text-left">作成日</th>
              <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <CarTable cars={cars ?? []} />
        </table>
      </div>
    </div>
  )
}
