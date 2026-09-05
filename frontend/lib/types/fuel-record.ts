import { ApiResponse } from './api'

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
  gas_station_name?: string
  distance_traveled?: number | null
  fuel_amount?: number | null
  fuel_efficiency?: number | null
  created_at: string
  updated_at: string
}

export type FuelRecordsResponse = ApiResponse<FuelRecord[]>
export type FuelRecordResponse = ApiResponse<FuelRecord>

export interface CreateFuelRecordInput {
  vehicle_id: string
  refuel_datetime: string
  total_mileage: number
  fuel_type: string
  unit_price: number
  total_cost: number
  is_full_tank?: boolean
  gas_station_name?: string
}

export interface UpdateFuelRecordInput {
  refuel_datetime?: string
  total_mileage?: number
  fuel_type?: string
  unit_price?: number
  total_cost?: number
  is_full_tank?: boolean
  gas_station_name?: string
}
