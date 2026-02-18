"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingCalendar } from "@/components/booking-calendar"
import { BookingTimeSlots } from "@/components/booking-time-slots"
import { BookingForm } from "@/components/booking-form"
import { usePortfolio } from "@/lib/portfolio-context"
import { DEFAULT_TIME_SLOTS, formatDate } from "@/lib/booking-data"
import { cn } from "@/lib/utils"

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

  if (!isOpen) return null

  const selectedService = services.find((s) => s.id === selectedServiceId)

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
              step === "service" ? "bg-accent text-accent-foreground" : "bg-accent/20 text-accent",
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
                ? "bg-accent text-accent-foreground"
                : step === "details"
                  ? "bg-accent/20 text-accent"
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
              step === "details" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
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
                    "bg-card border-border hover:border-accent hover:bg-accent/5",
                    selectedServiceId === service.id && "border-accent bg-accent/10",
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
                  <BookingTimeSlots
                    slots={DEFAULT_TIME_SLOTS}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                  />

                  {selectedTime && (
                    <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                      <h4 className="font-medium text-foreground mb-2">Your Selection</h4>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-accent">{selectedService?.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedDate)} at {selectedTime}
                      </p>
                      <Button
                        onClick={handleDateTimeConfirm}
                        className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
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
