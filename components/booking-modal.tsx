"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingTimeSlots } from "@/components/booking-time-slots"
import { BookingForm } from "@/components/booking-form"
import { usePortfolio } from "@/lib/portfolio-context"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedServiceId?: string
}

type BookingStep = "service" | "datetime" | "details"

export function BookingModal({ isOpen, onClose, preselectedServiceId }: BookingModalProps) {
  const { services } = usePortfolio()
  const [step, setStep] = useState<BookingStep>("service")
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(preselectedServiceId || null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preselectedServiceId) {
        setSelectedServiceId(preselectedServiceId)
        setStep("datetime")
      } else {
        setStep("service")
        setSelectedServiceId(null)
      }
      setSelectedDate(null)
      setSelectedTime(null)
    }
  }, [isOpen, preselectedServiceId])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const selectedService = services.find((s) => s.id === selectedServiceId)

  // Fetch available slots from Convex
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
  const availableSlots = useQuery(api.availability.getAvailableSlots,
    selectedDate && selectedService ?
      { date: formattedDate, serviceDuration: selectedService.duration } : "skip"
  )

  if (!isOpen) return null

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setStep("datetime")
  }

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      setStep("details")
    }
  }

  const handleBack = () => {
    if (step === "details") {
      setStep("datetime")
    } else if (step === "datetime") {
      setStep("service")
      setSelectedServiceId(null)
    }
  }

  const handleSuccess = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-secondary border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-serif text-2xl text-foreground">Book an Appointment</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {step === "service" && "Select a service"}
              {step === "datetime" && "Choose your preferred date & time"}
              {step === "details" && "Enter your contact details"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-card/50">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              step === "service" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary",
            )}
          >
            <Sparkles size={14} />
            <span>Service</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              step === "datetime"
                ? "bg-primary text-primary-foreground"
                : step === "details"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground",
            )}
          >
            <Calendar size={14} />
            <span>Date & Time</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors",
              step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <Clock size={14} />
            <span>Details</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Service Selection */}
          {step === "service" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={cn(
                    "text-left p-5 rounded-xl border transition-all duration-200",
                    "bg-card border-border hover:border-primary hover:bg-primary/5",
                    selectedServiceId === service.id && "border-primary bg-primary/10",
                  )}
                >
                  <h3 className="font-serif text-lg text-foreground mb-1">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-accent">{service.duration}</span>
                    <span className="text-foreground font-medium">{service.price}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === "datetime" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

              {selectedDate ? (
                <div className="space-y-6">
                  {selectedService && availableSlots !== undefined ? (
                    availableSlots.length > 0 ? (
                      <BookingTimeSlots
                        slots={availableSlots}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                      />
                    ) : (
                      <div className="bg-card border border-border rounded-xl p-6 text-center">
                        <p className="text-muted-foreground">No available time slots for this date.</p>
                      </div>
                    )
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-6 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                      <h4 className="font-medium text-foreground mb-2">Your Selection</h4>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary">{selectedService?.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedDate)} at {selectedTime}
                      </p>
                      <Button
                        onClick={handleDateTimeConfirm}
                        className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Select a date to see available times</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Contact Details */}
          {step === "details" && selectedDate && selectedTime && selectedService && (
            <div className="max-w-md mx-auto">
              <BookingForm
                serviceId={selectedService.id}
                serviceName={selectedService.name}
                duration={selectedService.duration}
                date={formatDate(selectedDate)}
                time={selectedTime}
                onBack={handleBack}
                onSuccess={handleSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
