"use client"

import { useEffect, useRef, useState } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { ImageIcon, Instagram, Linkedin, Globe } from "lucide-react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const portfolio = usePortfolio()
  const siteContent = portfolio?.siteContent

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#9988ff]"
    >
      {/* Dynamic Background Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#8877ee] via-transparent to-[#aa99ff] opacity-50"
      />

      {/* Floating orbs for depth */}
      <div
        className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-white/20 blur-[120px] pointer-events-none animate-pulse"
        style={{ transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)` }}
      />

      <div className="relative w-full h-full max-w-[1800px] mx-auto px-6 lg:px-12 flex flex-col justify-between py-12 lg:py-20 z-10">

        {/* Top Header Row / Metadata */}
        <div className="flex justify-between items-start pt-12">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-[0.3em] font-medium text-white/60">EST. 2019</span>
            <span className="text-xs tracking-[0.15em] font-medium text-white">{siteContent.heroLocation}</span>
          </div>
          <div className="text-right space-y-1">
            <p className="text-white/90 text-sm font-medium tracking-tight">Creative direction</p>
            <p className="text-white/60 text-[10px] uppercase tracking-widest">
              {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
            </p>
          </div>
        </div>

        {/* Central Dominant Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg lg:max-w-2xl px-6">
          <div
            className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`,
              boxShadow: `${mousePosition.x * -20}px ${mousePosition.y * -20}px 60px rgba(0,0,0,0.3)`
            }}
          >
            {siteContent.heroImage ? (
              <img
                src={siteContent.heroImage}
                alt="Trinity Portrait"
                className="w-full h-full object-cover scale-110"
              />
            ) : (
              <div className="w-full h-full bg-white/5 backdrop-blur-3xl flex items-center justify-center border border-white/10">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/20" />
                  </div>
                  <span className="text-xs tracking-[0.2em] font-medium text-white/30 uppercase">Artist Placeholder</span>
                </div>
              </div>
            )}
            {/* Glossy overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
          </div>
        </div>

        {/* Bottom Navigation / Bio & Socials (LEFT) */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="max-w-xs space-y-8">
            {/* Social Links */}
            <div className="flex gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
              <a href={siteContent.contactInstagram} className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Instagram</a>
              <a href={siteContent.bookingUrl} className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Book Now</a>
            </div>

            {/* Bio Text */}
            <p className="text-white/80 text-sm leading-relaxed font-light tracking-wide italic">
              {siteContent.heroBio}
            </p>
          </div>

          {/* Massive Headline (RIGHT) */}
          <div
            className="transition-transform duration-300 ease-out text-right lg:text-left"
            style={{ transform: `translateX(${mousePosition.x * -10}px)` }}
          >
            <h1 className="font-serif text-[15vw] lg:text-[12vw] leading-[0.85] text-white tracking-tighter drop-shadow-2xl">
              <span className="block opacity-90">{siteContent.heroHeadlineTop}</span>
              <span className="block italic">{siteContent.heroHeadlineBottom}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>

      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  )
}
