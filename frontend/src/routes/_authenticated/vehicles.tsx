import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { VehicleDialog } from '@/components/VehicleDialog'
import { VehicleList } from '@/components/VehicleList'
import { useVehicles } from '@/hooks/queries/useVehicles'

import type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'

export const Route = createFileRoute('/_authenticated/vehicles')({
  component: VehiclesPage,
})
function VehiclesPage() {
  const {
    vehicles,
    isLoading,
    editingVehicle,
    setEditingVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleAddNew = () => {
    setEditingVehicle(null)
    setIsDialogOpen(true)
  }
  const handleEditVehicle = (vehicleToEdit: Vehicle) => {
    setEditingVehicle(vehicleToEdit)
    setIsDialogOpen(true)
  }
  const handleSubmitForm = (data: CreateVehicleInput | UpdateVehicleInput) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data)
    } else {
      addVehicle(data as CreateVehicleInput)
    }
    setIsDialogOpen(false)
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
        onDelete={deleteVehicle}
        isLoading={isLoading}
      />
    </>
  )
}
