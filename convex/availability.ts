import { query } from "./_generated/server";
import { v } from "convex/values";
import { format, addMinutes, isBefore, isAfter, startOfDay, addDays, parse } from "date-fns";

export const getAvailableSlots = query({
    args: { date: v.string(), serviceDuration: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.serviceDuration || !args.date) return [];

        // Parse duration (e.g. "4 Hours" -> 240, "4.5 Hours" -> 270)
        let parsedMins = 0;
        const durStr = args.serviceDuration.toLowerCase();
        if (durStr.includes("hour")) {
            const hrs = parseFloat(durStr.split(" ")[0]);
            if (!isNaN(hrs)) parsedMins = hrs * 60;
        } else if (durStr.includes("min")) {
            const mins = parseFloat(durStr.split(" ")[0]);
            if (!isNaN(mins)) parsedMins = mins;
        }

        if (parsedMins === 0) parsedMins = 60; // Default fallback 1 hour

        const durationMins = parsedMins;

        // Fetch existing appointments for this date
        const existingAppointments = await ctx.db
            .query("appointments")
            .withIndex("by_date", (q) => q.eq("date", args.date))
            .filter(q => q.neq(q.field("status"), "cancelled"))
            .collect();

        // Operating Hours: 9:00 AM to 6:00 PM
        const targetDate = parse(args.date, "yyyy-MM-dd", new Date());

        const dayStart = new Date(targetDate);
        dayStart.setHours(9, 0, 0, 0); // 9 AM

        const dayEnd = new Date(targetDate);
        dayEnd.setHours(18, 0, 0, 0); // 6 PM

        const blockedIntervals = existingAppointments.map(app => {
            const appStart = parse(`${app.date} ${app.timeSlot}`, "yyyy-MM-dd hh:mm a", new Date());

            let appMins = 60;
            const aDurStr = (app.duration || "1 Hour").toLowerCase();
            if (aDurStr.includes("hour")) {
                const aHrs = parseFloat(aDurStr.split(" ")[0]);
                if (!isNaN(aHrs)) appMins = aHrs * 60;
            } else if (aDurStr.includes("min")) {
                const aMins = parseFloat(aDurStr.split(" ")[0]);
                if (!isNaN(aMins)) appMins = aMins;
            }

            const appEnd = addMinutes(appStart, appMins);
            return { start: appStart, end: appEnd };
        });

        // Generate possible slots
        const possibleSlots = [];
        let currentSlot = dayStart;
        while (currentSlot < dayEnd) {
            possibleSlots.push(currentSlot);
            currentSlot = addMinutes(currentSlot, 30); // 30-min increments
        }

        // Filter out slots that overlap or would cause the service to run past closing
        const availableSlots = possibleSlots.filter(slot => {
            const slotEnd = addMinutes(slot, durationMins);
            if (isAfter(slotEnd, dayEnd)) return false; // Exceeds closing time

            const overlaps = blockedIntervals.some(interval => {
                // A slot overlaps if it starts before an interval ends AND ends after the interval starts
                return isBefore(slot, interval.end) && isAfter(slotEnd, interval.start);
            });

            return !overlaps;
        });

        return availableSlots.map(slot => format(slot, "hh:mm a"));
    }
});
