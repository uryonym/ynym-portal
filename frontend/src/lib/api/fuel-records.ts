import {
  FuelRecordResponse,
  FuelRecordsResponse,
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
} from '@/lib/types/fuel-record'
import { apiClient } from './client'

export async function fetchFuelRecords(
  vehicleId: string,
): Promise<FuelRecordsResponse> {
  return apiClient.get<FuelRecordsResponse>(
    `/api/fuel-records?vehicle_id=${encodeURIComponent(vehicleId)}`,
  )
}

export async function createFuelRecord(
  input: CreateFuelRecordInput,
): Promise<FuelRecordResponse> {
  return apiClient.post<FuelRecordResponse>('/api/fuel-records', input)
}

export async function updateFuelRecord(
  id: string,
  input: UpdateFuelRecordInput,
): Promise<FuelRecordResponse> {
  return apiClient.put<FuelRecordResponse>(`/api/fuel-records/${id}`, input)
}

export async function deleteFuelRecord(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/fuel-records/${id}`)
}
