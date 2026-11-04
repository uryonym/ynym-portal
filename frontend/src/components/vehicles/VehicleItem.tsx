import { Pencil, Car } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Vehicle } from '@/lib/types/vehicle'

interface VehicleItemProps {
  vehicle: Vehicle
  onEdit: (vehicle: Vehicle) => void
}
export function VehicleItem({ vehicle, onEdit }: VehicleItemProps) {
  return (
    <div className="group flex flex-col justify-between p-4 bg-card rounded-xl border border-border/80 shadow-2xs hover:border-primary/30 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                {vehicle.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {vehicle.maker} {vehicle.model}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(vehicle)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
            aria-label="編集"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-center text-xs">
          <div className="bg-muted/40 p-1.5 rounded-lg">
            <span className="block text-[10px] text-muted-foreground">
              年式
            </span>
            <span className="font-medium text-foreground">
              {vehicle.year ? `${vehicle.year}年` : '-'}
            </span>
          </div>
          <div className="bg-muted/40 p-1.5 rounded-lg">
            <span className="block text-[10px] text-muted-foreground">
              ナンバー
            </span>
            <span className="font-medium text-foreground">
              {vehicle.number || '-'}
            </span>
          </div>
          <div className="bg-muted/40 p-1.5 rounded-lg">
            <span className="block text-[10px] text-muted-foreground">
              タンク
            </span>
            <span className="font-medium text-foreground">
              {vehicle.tank_capacity ? `${vehicle.tank_capacity}L` : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
