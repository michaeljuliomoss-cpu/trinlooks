import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAppointments = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("appointments").collect();
    },
});

export const createAppointment = mutation({
    args: {
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.string(),
        serviceId: v.string(),
        date: v.string(),
        timeSlot: v.string(),
        duration: v.string(),
    },
    handler: async (ctx, args) => {
        const appointmentId = await ctx.db.insert("appointments", {
            ...args,
            status: "pending",
            createdAt: Date.now(),
        });
        return appointmentId;
    },
});

export const confirmAppointment = mutation({
    args: { id: v.id("appointments"), googleEventId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: "confirmed",
            ...(args.googleEventId ? { googleEventId: args.googleEventId } : {}),
        });
    },
});

export const completeAppointment = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: "completed" });
    },
});

export const cancelAppointment = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: "cancelled" });
    },
});

export const deleteAppointment = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
