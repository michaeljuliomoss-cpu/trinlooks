"use client"

import { useEffect } from "react"
import { usePortfolio } from "@/lib/portfolio-context"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null
}

/**
 * Derives a full set of CSS variable overrides from the 5 user-chosen hex colors.
 * We set raw hex values directly onto CSS custom properties using style attributes
 * on the <html> element, overriding the oklch values from globals.css.
 */
function buildCssOverrides(colors: {
    primary: string
    accent: string
    background: string
    card: string
    secondary: string
}): Record<string, string> {
    const overrides: Record<string, string> = {}

    overrides["--background"] = colors.background
    overrides["--color-background"] = colors.background
    overrides["--card"] = colors.card
    overrides["--color-card"] = colors.card
    overrides["--popover"] = colors.card
    overrides["--color-popover"] = colors.card
    overrides["--primary"] = colors.primary
    overrides["--color-primary"] = colors.primary
    overrides["--ring"] = colors.primary
    overrides["--color-ring"] = colors.primary
    overrides["--accent"] = colors.accent
    overrides["--color-accent"] = colors.accent
    overrides["--secondary"] = colors.secondary
    overrides["--color-secondary"] = colors.secondary
    overrides["--muted"] = colors.secondary
    overrides["--color-muted"] = colors.secondary
    overrides["--input"] = colors.secondary
    overrides["--color-input"] = colors.secondary

    // Derive border from secondary (slightly lighter)
    const secRgb = hexToRgb(colors.secondary)
    if (secRgb) {
        const borderR = Math.min(255, secRgb.r + 30)
        const borderG = Math.min(255, secRgb.g + 30)
        const borderB = Math.min(255, secRgb.b + 30)
        const borderHex = `#${borderR.toString(16).padStart(2, "0")}${borderG.toString(16).padStart(2, "0")}${borderB.toString(16).padStart(2, "0")}`
        overrides["--border"] = borderHex
        overrides["--color-border"] = borderHex
    }

    return overrides
}

const DEFAULT_COLORS = {
    primary: "#D4AF37",
    accent: "#C97B5A",
    background: "#0B0114",
    card: "#1A0A2E",
    secondary: "#1F0535",
}

const ALL_CUSTOM_PROPS = [
    "--background", "--color-background",
    "--card", "--color-card",
    "--popover", "--color-popover",
    "--primary", "--color-primary",
    "--ring", "--color-ring",
    "--accent", "--color-accent",
    "--secondary", "--color-secondary",
    "--muted", "--color-muted",
    "--input", "--color-input",
    "--border", "--color-border",
]

export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
    const { siteContent } = usePortfolio()

    useEffect(() => {
        const colors = siteContent?.themeColors
        if (!colors) return

        // Check if any color differs from default
        const isCustom = Object.keys(DEFAULT_COLORS).some(
            (key) => colors[key as keyof typeof colors] !== DEFAULT_COLORS[key as keyof typeof DEFAULT_COLORS]
        )

        const html = document.documentElement

        if (isCustom) {
            const overrides = buildCssOverrides(colors)
            Object.entries(overrides).forEach(([prop, value]) => {
                html.style.setProperty(prop, value)
            })
        } else {
            ALL_CUSTOM_PROPS.forEach((prop) => html.style.removeProperty(prop))
        }

        return () => {
            ALL_CUSTOM_PROPS.forEach((prop) => html.style.removeProperty(prop))
        }
    }, [siteContent?.themeColors])

    return <>{children}</>
}
