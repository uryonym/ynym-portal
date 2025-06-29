import React from 'react'

import SectionFormSheet from './SectionFormSheet'
import SectionTable from './SectionTable'
import { getSections } from '../actions/sections'

export default async function Section() {
  const { sections, error } = await getSections()

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <p className="mb-4 text-xl font-bold">セクション管理</p>
      <SectionFormSheet mode="create" />
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">名前</th>
              <th className="border border-gray-300 px-4 py-2 text-left">順序</th>
              <th className="border border-gray-300 px-4 py-2 text-left">作成日</th>
              <th className="border border-gray-300 px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <SectionTable sections={sections ?? []} />
        </table>
      </div>
    </div>
  )
}
