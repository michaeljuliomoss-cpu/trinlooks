---
description: CMS system for Trin's Looks — admin panel, content management, booking, emails, and theme customization
---

# Trin's Looks CMS System

## Overview
The CMS is a fully-featured admin dashboard at `/admin` that allows the site owner to manage all aspects of the website without touching code.

## Architecture

### Stack
- **Frontend**: Next.js App Router + React + Tailwind CSS
- **Backend**: Convex (real-time database, mutations, queries, actions)
- **Email**: Resend API via Convex server actions
- **Notifications**: WhatsApp via Convex actions
- **Calendar**: Google Calendar sync via Convex actions

### Data Flow
1. Site content is stored as key/value pairs in the Convex `siteContent` table
2. The `PortfolioProvider` context reads from Convex and provides data to all components
3. Admin mutations write back to Convex, which triggers real-time updates across all clients
4. Theme colors are stored in `siteContent` under the `themeColors` key and applied via CSS custom properties

## Admin Panel Tabs

### 1. Appointments
- View all bookings sorted by date
- Confirm, decline, complete, or delete appointments
- Shows customer name, email, phone, service, date/time, and status badges

### 2. Hero
- Edit hero headline top/bottom text
- Upload or paste hero featured image URL

### 3. About
- Edit biography title and story content
- Upload or paste about portrait image

### 4. Services
- Add, edit, or delete services
- Each service has: name, description, duration, price
- Services sync to the booking system

### 5. Portfolio
- Manage photo categories (add/delete)
- Upload images to categories via file picker or URL
- View recent photos with delete capability

### 6. Contact
- Edit email, phone, address
- Edit Instagram handle and YouTube URL

### 7. Appearance (Theme Customization)
- **Color Wheel Pickers**: Click to open native color picker for each of 5 theme colors
- **Hex Code Inputs**: Type exact hex values (e.g., `D4AF37`)
- **Preset Palettes**: One-click themes (Royal Purple, Ocean Blue, Rose Gold, Midnight Green, Sunset Flame, Neon Pink)
- **Live Preview**: Mini card showing how buttons, tags, and backgrounds look with current colors
- **Reset to Default**: Restore original Royal Purple theme
- Colors are: Primary (buttons/links), Accent (tags/badges), Background, Card/Surface, Secondary/Muted

### 8. Settings
- Notification email configuration
- Maintenance mode toggle
- Search visibility toggle

## Key Files

| File | Purpose |
|------|---------|
| `app/admin/page.tsx` | Main admin dashboard with all tabs |
| `lib/portfolio-data.ts` | TypeScript interfaces and default data |
| `lib/portfolio-context.tsx` | React context provider for all CMS data |
| `components/theme-customization-provider.tsx` | Applies saved theme colors as CSS overrides |
| `convex/siteContent.ts` | Convex mutations/queries for all content |
| `convex/emails.ts` | Resend email actions (contact + booking) |
| `convex/appointments.ts` | Appointment CRUD mutations |
| `convex/availability.ts` | Time slot availability queries |
| `convex/whatsapp.ts` | WhatsApp notification action |
| `convex/calendarApi.ts` | Google Calendar sync action |
| `convex/schema.ts` | Database schema definitions |

## Authentication
- Simple username/password login (hardcoded for demo: `TrinTrin` / `Googoogaga12`)
- Admin state managed via React `useState`

## How Theme Customization Works
1. Owner picks colors via color wheel or hex input in the Appearance tab
2. Changes apply instantly via inline CSS custom property overrides on `<html>`
3. On "Publish Content", colors are saved to Convex under `themeColors` key
4. On page load, `ThemeCustomizationProvider` reads saved colors and applies them
5. If colors match defaults, no overrides are applied (CSS file values take effect)
