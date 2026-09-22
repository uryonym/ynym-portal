import type { SuccessResponse } from './api'

export interface Vehicle {
  id: string
  user_id: string
  name: string
  seq: number
  maker: string
  model: string
  year: number | null
  number: string | null
  tank_capacity: number | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateVehicleInput {
  name: string
  maker: string
  model: string
  year?: number | null
  number?: string | null
  tank_capacity?: number | null
}

export interface UpdateVehicleInput {
  name?: string | null
  seq?: number | null
  maker?: string | null
  model?: string | null
  year?: number | null
  number?: string | null
  tank_capacity?: number | null
}

export type VehicleResponse = SuccessResponse<Vehicle>
export type VehiclesResponse = SuccessResponse<Vehicle[]>
