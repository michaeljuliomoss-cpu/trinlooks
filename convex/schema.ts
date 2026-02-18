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
});
