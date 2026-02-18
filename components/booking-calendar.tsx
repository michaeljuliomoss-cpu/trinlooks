"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { isDateAvailable } from "@/lib/booking-data"

interface BookingCalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

export function BookingCalendar({ selectedDate, onDateSelect }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const days = []
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />)
  }

  // Add day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const isAvailable = isDateAvailable(date)
    const isSelected =
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()

    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()

    days.push(
      <button
        key={day}
        onClick={() => isAvailable && onDateSelect(date)}
        disabled={!isAvailable}
        className={cn(
          "h-10 w-10 rounded-full text-sm transition-all duration-200 flex items-center justify-center mx-auto",
          isAvailable
            ? "hover:bg-accent hover:text-accent-foreground cursor-pointer"
            : "text-muted-foreground/30 cursor-not-allowed",
          isSelected && "bg-accent text-accent-foreground font-medium",
          isToday && !isSelected && "ring-1 ring-accent/50",
        )}
      >
        {day}
      </button>,
    )
  }

  // Check if we can go to previous month (not before current month)
  const canGoPrev = currentMonth > new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </Button>
        <h3 className="font-serif text-lg text-foreground">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="text-muted-foreground hover:text-foreground">
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}
