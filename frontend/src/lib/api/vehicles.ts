import {
  VehiclesResponse,
  VehicleResponse,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'
import { apiClient } from './client'

export async function fetchVehicles(): Promise<VehiclesResponse> {
  return apiClient.get<VehiclesResponse>('/api/vehicles')
}

export async function createVehicle(
  input: CreateVehicleInput,
): Promise<VehicleResponse> {
  return apiClient.post<VehicleResponse>('/api/vehicles', input)
}

export async function updateVehicle(
  id: string,
  input: UpdateVehicleInput,
): Promise<VehicleResponse> {
  return apiClient.put<VehicleResponse>(`/api/vehicles/${id}`, input)
}

export async function deleteVehicle(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/vehicles/${id}`)
}
