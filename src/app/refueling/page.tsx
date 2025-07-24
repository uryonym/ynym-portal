import RefuelingList from './RefuelingList'
import SelectCar from './SelectCar'
import { getCars } from '../actions/cars'

export default async function RefuelingPage({
  searchParams,
}: {
  searchParams: Promise<{ carId?: string }>
}) {
  const carId = (await searchParams).carId
  const cars = await getCars()

  return (
    <div className="p-4">
      <p className="mb-4 text-xl font-bold">給油記録ページ</p>
      <SelectCar cars={cars} carId={carId} />
      <RefuelingList carId={carId} />
    </div>
  )
}
