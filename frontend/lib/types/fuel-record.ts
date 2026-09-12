import type { components } from './generated/schema'

export type FuelRecord = components['schemas']['FuelRecordResponse']
export type CreateFuelRecordInput = components['schemas']['FuelRecordCreate']
export type UpdateFuelRecordInput = components['schemas']['FuelRecordUpdate']
export type FuelRecordResponse =
  components['schemas']['SuccessResponse_FuelRecordResponse_']
export type FuelRecordsResponse =
  components['schemas']['SuccessResponse_list_FuelRecordResponse__']
