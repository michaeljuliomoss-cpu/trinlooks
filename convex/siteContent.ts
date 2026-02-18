import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// Get all site content
export const getSiteContent = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("siteContent").collect();
    },
});

// Update or insert site content
export const updateSiteContent = mutation({
    args: {
        key: v.string(),
        value: v.any(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("siteContent")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("siteContent", { key: args.key, value: args.value });
        }
    },
});

// Portfolio Categories
export const getCategories = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

export const updateCategory = mutation({
    args: {
        id: v.string(),
        name: v.string(),
        description: v.string(),
        coverImage: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("categories")
            .withIndex("by_category_id", (q) => q.eq("id", args.id))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                name: args.name,
                description: args.description,
                coverImage: args.coverImage
            });
        } else {
            await ctx.db.insert("categories", args);
        }
    },
});

// Portfolio Images
export const getImages = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("portfolioImages").collect();
    },
});

export const addImage = mutation({
    args: {
        id: v.string(),
        categoryId: v.string(),
        imageUrl: v.string(),
        title: v.string(),
        description: v.string(),
        role: v.string(),
        year: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("portfolioImages", args);
    },
});

export const deleteImage = mutation({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        const images = await ctx.db.query("portfolioImages").collect();
        const imageToDelete = images.find(img => img.id === args.id);
        if (imageToDelete) {
            await ctx.db.delete(imageToDelete._id);
        }
    },
});

// Services
export const getServices = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("services").collect();
    },
});

export const updateService = mutation({
    args: {
        id: v.string(),
        name: v.string(),
        description: v.string(),
        duration: v.string(),
        price: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("services").collect();
        const service = existing.find(s => s.id === args.id);
        if (service) {
            await ctx.db.patch(service._id, args);
        } else {
            await ctx.db.insert("services", args);
        }
    },
});

// Admin Auth (Simple demo check)
export const checkAdmin = query({
    args: { username: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const admin = await ctx.db.query("adminAccess").first();
        if (!admin) return true; // Default to true if no admin setup yet for first time
        return admin.username === args.username && admin.password === args.password;
    },
});

export const setupAdmin = mutation({
    args: { username: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("adminAccess").collect();
        for (const admin of existing) {
            await ctx.db.delete(admin._id);
        }
        await ctx.db.insert("adminAccess", args);
    },
});
