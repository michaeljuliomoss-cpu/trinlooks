import { type NextRequest, NextResponse } from "next/server"
import type { BookingData } from "@/lib/booking-data"

// Twilio configuration - add your credentials in environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

// Google Calendar configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary"

// Helper to send SMS via Twilio
async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.log("[v0] Twilio not configured, skipping SMS")
    return false
  }

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Twilio error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] SMS send failed:", error)
    return false
  }
}

// Helper to get Google access token from refresh token
async function getGoogleAccessToken(): Promise<string | null> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    console.log("[v0] Google Calendar not configured")
    return null
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to get Google access token")
      return null
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("[v0] Google token error:", error)
    return null
  }
}

// Helper to add event to Google Calendar
async function addToGoogleCalendar(booking: BookingData, serviceName: string): Promise<boolean> {
  const accessToken = await getGoogleAccessToken()
  if (!accessToken) return false

  try {
    // Parse the date and time
    const dateStr = booking.date
    const timeStr = booking.time

    // Create start and end times (assuming 1-hour appointment)
    const startDateTime = new Date(`${dateStr} ${timeStr}`)
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

    const event = {
      summary: `Booking: ${serviceName} - ${booking.name}`,
      description: `Client: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\n\nNotes: ${booking.notes || "None"}`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "America/New_York",
      },
      attendees: [{ email: booking.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Google Calendar error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Calendar add failed:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const booking: BookingData = await request.json()

    // Validate required fields
    if (!booking.serviceId || !booking.date || !booking.time || !booking.name || !booking.email || !booking.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get service name for notifications
    const serviceName = booking.serviceId // In production, look this up from your database

    // Send SMS confirmation
    const smsMessage = `Hi ${booking.name}! Your appointment for ${serviceName} is confirmed for ${booking.date} at ${booking.time}. See you then! - Trin's Looks`
    const smsSent = await sendSMS(booking.phone, smsMessage)

    // Add to Google Calendar
    const calendarAdded = await addToGoogleCalendar(booking, serviceName)

    // In production, you would also:
    // 1. Save the booking to your database
    // 2. Send email confirmation
    // 3. Handle payment if required

    return NextResponse.json({
      success: true,
      message: "Booking confirmed",
      smsSent,
      calendarAdded,
      booking: {
        ...booking,
        confirmationNumber: `TL-${Date.now().toString(36).toUpperCase()}`,
      },
    })
  } catch (error) {
    console.error("[v0] Booking error:", error)
    return NextResponse.json({ error: "Failed to process booking" }, { status: 500 })
  }
}
