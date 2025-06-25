import React from 'react'

import RefuelingFormSheet from './RefuelingFormSheet'
import RefuelingTable from './RefuelingTable'
import { getRefuelings } from '../actions/refuelings'

export default async function Refueling() {
  const { refuelings, error } = await getRefuelings()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-bold">給油記録ページ</p>
      <RefuelingFormSheet mode="create" />
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">日付</th>
              <th className="border border-gray-300 px-4 py-2 text-left">走行距離</th>
              <th className="border border-gray-300 px-4 py-2 text-left">燃料種別</th>
              <th className="border border-gray-300 px-4 py-2 text-left">単価</th>
              <th className="border border-gray-300 px-4 py-2 text-left">合計金額</th>
              <th className="border border-gray-300 px-4 py-2 text-left">満タン</th>
              <th className="border border-gray-300 px-4 py-2 text-left">スタンド</th>
              <th className="border border-gray-300 px-4 py-2 text-left">作成日</th>
              <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <RefuelingTable refuelings={refuelings ?? []} />
        </table>
      </div>
    </div>
  )
}
