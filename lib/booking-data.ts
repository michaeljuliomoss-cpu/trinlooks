// Booking configuration and types

export interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export interface BookingData {
  serviceId: string
  date: string
  time: string
  name: string
  email: string
  phone: string
  notes?: string
}

// Available time slots - can be configured
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: "9am", time: "9:00 AM", available: true },
  { id: "10am", time: "10:00 AM", available: true },
  { id: "11am", time: "11:00 AM", available: true },
  { id: "12pm", time: "12:00 PM", available: true },
  { id: "1pm", time: "1:00 PM", available: true },
  { id: "2pm", time: "2:00 PM", available: true },
  { id: "3pm", time: "3:00 PM", available: true },
  { id: "4pm", time: "4:00 PM", available: true },
  { id: "5pm", time: "5:00 PM", available: true },
]

// Business hours configuration
export const BUSINESS_HOURS = {
  startHour: 9,
  endHour: 18,
  daysOff: [0], // Sunday
}

// Helper to check if a date is available
export function isDateAvailable(date: Date): boolean {
  const day = date.getDay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Can't book in the past
  if (date < today) return false

  // Check if it's a day off
  if (BUSINESS_HOURS.daysOff.includes(day)) return false

  return true
}

// Helper to format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Helper to format date for API
export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0]
}
