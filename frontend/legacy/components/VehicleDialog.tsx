'use client'

import {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
} from '@/lib/types/vehicle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { VehicleForm } from './VehicleForm'

interface VehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Vehicle | null
  onSubmit: (data: CreateVehicleInput | UpdateVehicleInput) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function VehicleDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  onDelete,
  isLoading = false,
}: VehicleDialogProps) {
  const title = initialData ? '車両を編集' : '新しい車両を登録'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <VehicleForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
