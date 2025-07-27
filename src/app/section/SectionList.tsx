'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Section } from '@/generated/client'

import SectionFormSheet from './SectionFormSheet'

export default function SectionList({ sections }: { sections: Section[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section>()
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const handleNewClick = () => {
    setSelectedSection(undefined)
    setFormMode('create')
    setIsOpen(true)
  }

  const handleEditClick = (section: Section) => () => {
    setSelectedSection(section)
    setFormMode('edit')
    setIsOpen(true)
  }

  return (
    <>
      <div className="mb-2">
        <button
          className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={handleNewClick}
        >
          セクション追加
        </button>
      </div>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <div className="flex w-full items-center justify-between border-b border-gray-300 px-3 py-3">
              <Link
                href={`/section/${section.id}/note`}
                className="block flex-1 cursor-pointer text-blue-600 hover:underline"
              >
                {section.name}
              </Link>
              <button
                className="ml-3 p-1 text-gray-500 hover:text-blue-600"
                aria-label="編集"
                onClick={handleEditClick(section)}
                type="button"
              >
                {/* ペン型のSVGアイコン */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <SectionFormSheet
        mode={formMode}
        section={selectedSection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
