'use client'

import { useState } from 'react'
import { useVehicles } from '@/hooks/useVehicles'
import { VehicleList } from '@/components/VehicleList'
import { VehicleDialog } from '@/components/VehicleDialog'
import {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'

export default function VehiclesPage() {
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
      updateVehicle(editingVehicle.id, data as UpdateVehicleInput)
    } else {
      addVehicle(data as CreateVehicleInput)
    }
    setIsDialogOpen(false)
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">車両管理</h1>
          <VehicleList
            vehicles={vehicles}
            onEdit={handleEditVehicle}
            onAddNew={handleAddNew}
          />
        </div>
      </main>

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
