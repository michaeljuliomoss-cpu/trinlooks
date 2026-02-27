import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendWhatsAppNotification = action({
    args: {
        customerName: v.string(),
        serviceName: v.string(),
        date: v.string(),
        timeSlot: v.string(),
    },
    handler: async (ctx, args) => {
        const message = `🚨 *NEW BOOKING REQUEST* 🚨\nName: ${args.customerName}\nService: ${args.serviceName}\nDate: ${args.date}\nTime: ${args.timeSlot}\nPlease review and confirm in the admin dashboard.`;

        // Dummy placeholder action since we don't have real credentials yet
        const apiUrl = process.env.WHATSAPP_API_URL || "https://api.whatsapp.com/v1/messages";
        const groupId = process.env.WHATSAPP_GROUP_ID || "1234567890-placeholder-group";

        console.log(`Sending WhatsApp Notification to ${groupId}:`, message);

        if (!process.env.WHATSAPP_API_URL) {
            console.warn("WhatsApp API URL not set in environment. Skipping real fetch.");
            return;
        }

        try {
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: groupId, body: message }),
            });
        } catch (error) {
            console.error("Failed to send WhatsApp notification", error);
        }
    },
});
