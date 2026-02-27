import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    siteContent: defineTable({
        key: v.string(),
        value: v.any(),
    }).index("by_key", ["key"]),

    categories: defineTable({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        coverImage: v.string(),
    }).index("by_category_id", ["id"]),

    portfolioImages: defineTable({
        id: v.string(),
        categoryId: v.string(),
        imageUrl: v.string(),
        title: v.string(),
        description: v.string(),
        role: v.string(),
        year: v.string(),
    }).index("by_category", ["categoryId"]),

    services: defineTable({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        duration: v.string(),
        price: v.string(),
    }),

    // Simple auth record for demo purposes as requested
    adminAccess: defineTable({
        username: v.string(),
        password: v.string(),
    }),

    appointments: defineTable({
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.string(),
        serviceId: v.string(),
        date: v.string(),      // Format: YYYY-MM-DD
        timeSlot: v.string(),  // Format: HH:MM AM/PM
        duration: v.string(),  // Format: "X Hours", "X.X Hours", etc.
        status: v.string(),    // "pending" | "confirmed" | "completed" | "cancelled"
        googleEventId: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_date", ["date"]),
});
