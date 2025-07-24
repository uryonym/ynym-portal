'use client'

import { useRouter } from 'next/navigation'

import { Car } from '@/generated/client'

export default function SelectCar({ cars, carId }: { cars: Car[]; carId?: string }) {
  const router = useRouter()

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCarId = e.target.value
    router.replace(`/refueling?carId=${selectedCarId}`)
  }

  return (
    <div className="mb-4">
      <select
        className="rounded border border-gray-300 px-3 py-2"
        defaultValue={carId ?? ''}
        onChange={handleCarChange}
      >
        <option value="" disabled>
          車両を選択
        </option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.name}
          </option>
        ))}
      </select>
    </div>
  )
}
