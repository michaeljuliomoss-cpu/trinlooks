import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = action({
    args: {
        name: v.string(),
        email: v.string(),
        service: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const data = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: ["trinityfeaste2@icloud.com"], // Hardcoded to Trinity's email based on the footer
                subject: `New Inquiry from ${args.name}: ${args.service}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${args.name}</p>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Requested Service:</strong> ${args.service}</p>
          <p><strong>Message:</strong></p>
          <p>${args.message}</p>
        `,
            });
            return { success: true, data };
        } catch (error) {
            console.error("Error sending contact email:", error);
            return { success: false, error: String(error) };
        }
    },
});

export const sendBookingConfirmation = action({
    args: {
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.string(),
        date: v.string(),
        timeSlot: v.string(),
        serviceName: v.string(),
        duration: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            // 1. Send Confirmation to Customer
            const customerEmail = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: [args.customerEmail],
                subject: `Booking Confirmed: ${args.serviceName} on ${args.date}`,
                html: `
          <h2>Booking Confirmation</h2>
          <p>Hi ${args.customerName},</p>
          <p>Your booking for <strong>${args.serviceName}</strong> has been confirmed!</p>
          <h3>Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${args.date}</li>
            <li><strong>Time:</strong> ${args.timeSlot}</li>
            <li><strong>Duration:</strong> ${args.duration}</li>
            <li><strong>Location:</strong> Gladstone Road, Nassau, New Providence</li>
          </ul>
          <p>We look forward to seeing you!</p>
          <p>- Trin's Looks</p>
        `,
            });

            // 2. Send Notification to Trinity
            const adminEmail = await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: ["trinityfeaste2@icloud.com"], // Hardcoded to Trinity's email based on the footer
                subject: `New Booking: ${args.serviceName} on ${args.date}`,
                html: `
          <h2>New Booking Notification</h2>
          <p>A new booking has been scheduled.</p>
          <h3>Customer Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${args.customerName}</li>
            <li><strong>Email:</strong> ${args.customerEmail}</li>
            <li><strong>Phone:</strong> ${args.customerPhone}</li>
          </ul>
          <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Service:</strong> ${args.serviceName}</li>
            <li><strong>Date:</strong> ${args.date}</li>
            <li><strong>Time:</strong> ${args.timeSlot}</li>
            <li><strong>Duration:</strong> ${args.duration}</li>
          </ul>
        `,
            });

            return { success: true, customerEmail, adminEmail };
        } catch (error) {
            console.error("Error sending booking confirmation email:", error);
            return { success: false, error: String(error) };
        }
    },
});
