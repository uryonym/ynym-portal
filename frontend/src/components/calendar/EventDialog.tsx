import { EventForm } from '@/components/calendar/EventForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type {
  CalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from '@/lib/types/event'

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: Date
  initialEvent?: CalendarEvent | null
  onSubmit: (data: CreateEventInput | UpdateEventInput) => void
  isLoading?: boolean
}

export function EventDialog({
  open,
  onOpenChange,
  initialDate,
  initialEvent,
  onSubmit,
  isLoading = false,
}: EventDialogProps) {
  const isEditing = Boolean(initialEvent)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEditing ? '予定を編集' : '新しい予定を追加'}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-2">
          <EventForm
            initialDate={initialDate}
            initialEvent={initialEvent}
            onSubmit={(data) => {
              onSubmit(data)
              onOpenChange(false)
            }}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
