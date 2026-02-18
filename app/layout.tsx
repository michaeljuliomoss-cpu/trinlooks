import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PortfolioProvider } from "@/lib/portfolio-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Trin's Looks | Model • Creative • Beauty & Editorial",
  description:
    "Professional modeling, creative direction, and makeup artistry portfolio. Book sessions for editorial, glam, and beauty services.",
  keywords: ["model", "makeup artist", "beauty", "editorial", "creative direction", "portfolio"],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
}

import { ConvexClientProvider } from "@/components/convex-client-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans antialiased`}>
        <ConvexClientProvider>
          <PortfolioProvider>{children}</PortfolioProvider>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
