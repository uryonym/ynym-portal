import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { VehicleDialog } from '@/components/VehicleDialog'
import { VehicleList } from '@/components/VehicleList'
import {
  useVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '@/hooks/queries/useVehicles'

import type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'

export const Route = createFileRoute('/_authenticated/vehicles')({
  component: VehiclesPage,
})

function VehiclesPage() {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: vehicles = [] } = useVehiclesQuery()
  const createMutation = useCreateVehicleMutation()
  const updateMutation = useUpdateVehicleMutation()
  const deleteMutation = useDeleteVehicleMutation()

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  const handleAddNew = () => {
    setEditingVehicle(null)
    setIsDialogOpen(true)
  }

  const handleEditVehicle = (vehicleToEdit: Vehicle) => {
    setEditingVehicle(vehicleToEdit)
    setIsDialogOpen(true)
  }

  const handleSubmitForm = async (
    data: CreateVehicleInput | UpdateVehicleInput,
  ) => {
    try {
      if (editingVehicle) {
        await updateMutation.mutateAsync({ id: editingVehicle.id, data })
      } else {
        await createMutation.mutateAsync(data as CreateVehicleInput)
      }
      setIsDialogOpen(false)
    } catch {
      // エラーは mutation 内の onError で処理
    }
  }

  const handleDeleteVehicle = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <>
      <div className="max-w-4xl mx-auto w-full">
        <VehicleList
          vehicles={vehicles}
          onEdit={handleEditVehicle}
          onAddNew={handleAddNew}
        />
      </div>

      <VehicleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingVehicle}
        onSubmit={handleSubmitForm}
        onDelete={handleDeleteVehicle}
        isLoading={isMutating}
      />
    </>
  )
}
