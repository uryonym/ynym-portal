import type { SuccessResponse } from './api'

export interface FuelRecord {
  id: string
  vehicle_id: string
  user_id: string
  refuel_datetime: string
  total_mileage: number
  fuel_type: string
  unit_price: number
  total_cost: number
  is_full_tank: boolean
  gas_station_name: string | null
  distance_traveled: number | null
  fuel_amount: number | null
  fuel_efficiency: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateFuelRecordInput {
  vehicle_id: string
  refuel_datetime: string
  total_mileage: number
  fuel_type: string
  unit_price: number
  total_cost: number
  is_full_tank?: boolean
  gas_station_name?: string | null
}

export interface UpdateFuelRecordInput {
  refuel_datetime?: string | null
  total_mileage?: number | null
  fuel_type?: string | null
  unit_price?: number | null
  total_cost?: number | null
  is_full_tank?: boolean | null
  gas_station_name?: string | null
}

export type FuelRecordResponse = SuccessResponse<FuelRecord>
export type FuelRecordsResponse = SuccessResponse<FuelRecord[]>
