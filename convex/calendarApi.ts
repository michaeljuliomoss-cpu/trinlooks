"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { google } from "googleapis";
import { addMinutes, parse } from "date-fns";

function getCalendarClient() {
    // If not configured, return null to avoid crashing dev environments
    if (!process.env.GOOGLE_CALENDAR_CLIENT_EMAIL || !process.env.GOOGLE_CALENDAR_PRIVATE_KEY) {
        return null;
    }

    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
        key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });
    return google.calendar({ version: "v3", auth });
}

export const createEvent = internalAction({
    args: {
        appointmentId: v.id("appointments"),
        customerName: v.string(),
        serviceName: v.string(),
        date: v.string(),
        timeSlot: v.string(),
        duration: v.string(),
    },
    handler: async (ctx, args) => {
        const calendar = getCalendarClient();
        if (!calendar) {
            console.warn("Google Calendar is not configured.");
            return null;
        }

        const start = parse(`${args.date} ${args.timeSlot}`, "yyyy-MM-dd hh:mm a", new Date());

        let appMins = 60;
        const durStr = args.duration.toLowerCase();
        if (durStr.includes("hour")) {
            const hrs = parseFloat(durStr.split(" ")[0]);
            if (!isNaN(hrs)) appMins = hrs * 60;
        } else if (durStr.includes("min")) {
            const mins = parseFloat(durStr.split(" ")[0]);
            if (!isNaN(mins)) appMins = mins;
        }

        const end = addMinutes(start, appMins);

        const startIso = start.toISOString();
        const endIso = end.toISOString();

        try {
            const res = await calendar.events.insert({
                calendarId: "primary", // Or process.env.GOOGLE_CALENDAR_ID
                requestBody: {
                    summary: `${args.serviceName} - ${args.customerName}`,
                    start: { dateTime: startIso, timeZone: "America/New_York" },
                    end: { dateTime: endIso, timeZone: "America/New_York" },
                    extendedProperties: { private: { convexAppointmentId: args.appointmentId } },
                },
            });
            return res.data.id;
        } catch (error) {
            console.error("Failed to create Google Calendar event:", error);
            return null;
        }
    },
});

export const deleteEvent = internalAction({
    args: { appointmentId: v.id("appointments") },
    handler: async (ctx, args) => {
        const calendar = getCalendarClient();
        if (!calendar) return;

        try {
            const searchResponse = await calendar.events.list({
                calendarId: "primary",
                privateExtendedProperty: [`convexAppointmentId=${args.appointmentId}`],
            });

            if (searchResponse.data.items?.length) {
                await calendar.events.delete({
                    calendarId: "primary",
                    eventId: searchResponse.data.items[0].id!,
                });
            }
        } catch (error) {
            console.error("Failed to delete Google Calendar event:", error);
        }
    },
});
