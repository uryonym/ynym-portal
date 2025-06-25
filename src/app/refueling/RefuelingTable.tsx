'use client'

import { Refueling } from '@/generated/client'

import RefuelingFormSheet from './RefuelingFormSheet'

export default function RefuelingTable({ refuelings }: { refuelings: Refueling[] }) {
  return (
    <tbody>
      {refuelings.map((refueling) => (
        <tr key={refueling.id} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">
            {new Date(refueling.refuelDatetime).toLocaleString()}
          </td>
          <td className="border border-gray-300 px-4 py-2">{refueling.odometer}</td>
          <td className="border border-gray-300 px-4 py-2">{refueling.fuelType}</td>
          <td className="border border-gray-300 px-4 py-2">{refueling.price}</td>
          <td className="border border-gray-300 px-4 py-2">{refueling.totalCost}</td>
          <td className="border border-gray-300 px-4 py-2 text-center">
            {refueling.isFull ? '✔️' : ''}
          </td>
          <td className="border border-gray-300 px-4 py-2">{refueling.gasStand}</td>
          <td className="border border-gray-300 px-4 py-2">
            {new Date(refueling.createdAt).toLocaleString()}
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <RefuelingFormSheet mode="edit" refueling={refueling} />
          </td>
        </tr>
      ))}
    </tbody>
  )
}
