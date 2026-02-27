"use client"

import { cn } from "@/lib/utils"

interface BookingTimeSlotsProps {
  slots: string[]
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
            key={slot}
            onClick={() => onTimeSelect(slot)}
            className={cn(
              "py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 border",
              "border-border hover:border-accent hover:bg-accent/10 cursor-pointer",
              selectedTime === slot && "bg-accent text-accent-foreground border-accent hover:bg-accent",
            )}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  )
}
