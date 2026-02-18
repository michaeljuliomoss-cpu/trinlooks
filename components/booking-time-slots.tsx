"use client"

import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/lib/booking-data"

interface BookingTimeSlotsProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onTimeSelect: (time: string) => void
}

export function BookingTimeSlots({ slots, selectedTime, onTimeSelect }: BookingTimeSlotsProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-serif text-lg text-foreground mb-4">Select a Time</h3>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
            className={cn(
              "py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border",
              slot.available
                ? "border-border hover:border-accent hover:bg-accent/10 cursor-pointer"
                : "border-border/30 text-muted-foreground/30 cursor-not-allowed",
              selectedTime === slot.time && "bg-accent text-accent-foreground border-accent hover:bg-accent",
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  )
}
