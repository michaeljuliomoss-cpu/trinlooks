"use client"

import { useEffect, useState } from "react"
import { MapPin, Calendar, Mail, Instagram, ImageIcon } from "lucide-react"
import { usePortfolio } from "@/lib/portfolio-context"

export function AboutSection() {
  const [scrollY, setScrollY] = useState(0)
  const { siteContent } = usePortfolio()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="about" className="py-24 bg-background overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Purple glow accent */}
      <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[oklch(0.4_0.12_300)] blur-[150px] opacity-15 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-accent blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">About</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">{siteContent.aboutTitle}</h2>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column - Bio */}
          <div className="space-y-8">
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                {siteContent.aboutDescription1}
              </p>
              <p>
                {siteContent.aboutDescription2}
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-accent/50" />
                {siteContent.aboutSubtitle}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Modeling", desc: "Editorial & Runway" },
                  { label: "Creative", desc: "Art Direction" },
                  { label: "Beauty", desc: "Luxury Glam" },
                  { label: "Content", desc: "Brand Stories" },
                ].map((item, index) => (
                  <li key={index} className="group p-4 rounded-xl border border-border bg-card/50 hover:border-accent/30 hover:bg-card transition-all duration-300">
                    <p className="text-foreground font-medium mb-1">{item.label}</p>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column - Portrait + Stats */}
          <div className="relative">
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{
                transform: `translateY(${scrollY * 0.03}px)`,
              }}
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 via-[oklch(0.4_0.1_300)]/10 to-transparent rounded-xl blur-xl" />

              <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-card shadow-xl">
                {siteContent.aboutPortrait ? (
                  <img
                    src={siteContent.aboutPortrait || "/placeholder.svg"}
                    alt="Trinity Portrait"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-accent/50" />
                      </div>
                      <p className="text-muted-foreground font-medium">Portrait Image</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">Add via Admin Panel</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute -inset-3 border border-accent/20 rounded-xl -z-10" />
            </div>

            {/* Stats card overlay */}
            <div className="absolute -bottom-10 -left-6 lg:-left-20 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl max-w-xs ring-1 ring-white/20">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <div className="w-12 h-12 border-t-2 border-r-2 border-accent" />
              </div>

              <h4 className="font-serif text-xl text-foreground mb-6 flex items-center gap-2">
                Trinity Locks
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </h4>

              <div className="space-y-4">
                {[
                  { icon: MapPin, text: siteContent.contactLocation },
                  { icon: Calendar, text: "Bookings Open Q1 2024" },
                  { icon: Mail, text: siteContent.contactEmail },
                  { icon: Instagram, text: siteContent.contactInstagram }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm text-muted-foreground group">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <item.icon size={14} />
                    </div>
                    <span className="group-hover:text-foreground transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
