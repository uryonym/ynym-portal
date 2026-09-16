import type { components } from './generated/schema'

export type Vehicle = components['schemas']['VehicleResponse']
export type CreateVehicleInput = components['schemas']['VehicleCreate']
export type UpdateVehicleInput = components['schemas']['VehicleUpdate']
export type VehicleResponse =
  components['schemas']['SuccessResponse_VehicleResponse_']
export type VehiclesResponse =
  components['schemas']['SuccessResponse_list_VehicleResponse__']
