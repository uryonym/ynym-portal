'use client'

import { Section } from '@/generated/client'

import SectionFormSheet from './SectionFormSheet'

export default function SectionTable({ sections }: { sections: Section[] }) {
  return (
    <tbody>
      {sections.map((section) => (
        <tr key={section.id} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">{section.name}</td>
          <td className="border border-gray-300 px-4 py-2">{section.seq}</td>
          <td className="border border-gray-300 px-4 py-2">
            {new Date(section.createdAt).toLocaleString()}
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <SectionFormSheet mode="edit" section={section} />
          </td>
        </tr>
      ))}
    </tbody>
  )
}
