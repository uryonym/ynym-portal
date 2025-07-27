import RefuelingList from './RefuelingList'
import SelectCar from './SelectCar'
import { getCars } from '../actions/cars'
import { getRefuelings } from '../actions/refuelings'

export default async function RefuelingPage({
  searchParams,
}: {
  searchParams: Promise<{ carId?: string }>
}) {
  const carId = (await searchParams).carId
  const cars = await getCars()
  const refuelings = carId ? await getRefuelings(carId) : []

  return (
    <div className="p-4">
      <p className="mb-4 text-xl font-bold">給油記録ページ</p>
      <SelectCar cars={cars} carId={carId} />
      <RefuelingList carId={carId} refuelings={refuelings} />
    </div>
  )
}
