"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useMutation, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"

interface BookingFormProps {
  serviceId: string
  serviceName: string
  duration: string
  date: string
  time: string
  onBack: () => void
  onSuccess: () => void
}

export function BookingForm({ serviceId, serviceName, duration, date, time, onBack, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const createAppointment = useMutation(api.appointments.createAppointment)
  const sendWhatsAppNotification = useAction(api.whatsapp.sendWhatsAppNotification)
  const sendBookingEmail = useAction(api.emails.sendBookingConfirmation)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    try {
      // 1. Create the appointment in Convex
      await createAppointment({
        serviceId,
        date,
        timeSlot: time,
        duration,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
      })

      // 2. Send Email confirmation via Resend
      try {
        await sendBookingEmail({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          date,
          timeSlot: time,
          serviceName,
          duration,
        })
      } catch (emailError) {
        console.error("Email notification failed, but booking succeeded", emailError)
      }

      // 3. Send WhatsApp notification
      try {
        await sendWhatsAppNotification({
          customerName: formData.name,
          serviceName,
          date,
          timeSlot: time,
        })
      } catch (waError) {
        console.error("WhatsApp notification failed, but booking succeeded", waError)
      }

      setStatus("success")
      setTimeout(onSuccess, 3000)
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (status === "success") {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="font-serif text-2xl text-foreground mb-2">Booking Confirmed!</h3>
        <p className="text-muted-foreground mb-2">
          Your appointment for <span className="text-accent">{serviceName}</span> has been scheduled.
        </p>
        <p className="text-sm text-muted-foreground">
          {date} at {time}
        </p>
        <p className="text-sm text-muted-foreground mt-4">You'll receive a confirmation via email and SMS shortly.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="font-serif text-lg text-foreground mb-2">Your Details</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Booking <span className="text-accent">{serviceName}</span> on {date} at {time}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="bg-background border-border focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="bg-background border-border focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 123-4567"
            className="bg-background border-border focus:border-accent"
          />
          <p className="text-xs text-muted-foreground">We'll send appointment reminders via SMS</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requests or details..."
            className="bg-background border-border focus:border-accent min-h-[80px]"
          />
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-border hover:bg-secondary bg-transparent"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </form>

      {/* Google Calendar connection info */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Your booking will be synced with Google Calendar and you'll receive SMS reminders.
        </p>
      </div>
    </div>
  )
}
