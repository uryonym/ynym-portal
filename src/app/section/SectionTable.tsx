'use client'

import Link from 'next/link'

import { Section } from '@/generated/client'

import SectionFormSheet from './SectionFormSheet'

export default function SectionTable({ sections }: { sections: Section[] }) {
  return (
    <tbody>
      {sections.map((section) => (
        <tr key={section.id} className="hover:bg-gray-50">
          <td className="w-full border border-gray-300 px-4 py-2">
            <Link
              href={`/section/${section.id}/note`}
              className="block w-full cursor-pointer text-blue-600 hover:underline"
            >
              {section.name}
            </Link>
          </td>
          <td
            className="border border-gray-300 px-4 py-2 whitespace-nowrap"
            style={{ width: '1%' }}
          >
            <SectionFormSheet mode="edit" section={section} />
          </td>
        </tr>
      ))}
    </tbody>
  )
}
