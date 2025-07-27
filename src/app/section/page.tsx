import React from 'react'

import SectionList from './SectionList'
import { getSections } from '../actions/sections'

export default async function Section() {
  const sections = await getSections()

  return (
    <div className="p-3">
      <p className="mb-2 text-xl font-bold">ノート</p>
      <SectionList sections={sections} />
    </div>
  )
}
