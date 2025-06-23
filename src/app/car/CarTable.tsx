'use client'

import { Car } from '@/generated/client'

import CarFormSheet from './CarFormSheet'

export default function CarTable({ cars }: { cars: Car[] }) {
  return (
    <tbody>
      {cars.map((car) => (
        <tr key={car.id} className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">{car.name}</td>
          <td className="border border-gray-300 px-4 py-2">{car.maker}</td>
          <td className="border border-gray-300 px-4 py-2">{car.model}</td>
          <td className="border border-gray-300 px-4 py-2">{car.modelYear}</td>
          <td className="border border-gray-300 px-4 py-2">{car.licensePlate}</td>
          <td className="border border-gray-300 px-4 py-2">{car.tankCapacity}</td>
          <td className="border border-gray-300 px-4 py-2">
            {new Date(car.createdAt).toLocaleString()}
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <CarFormSheet mode="edit" car={car} />
          </td>
        </tr>
      ))}
    </tbody>
  )
}
