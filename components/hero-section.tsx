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
      className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-[#9988ff]"
    >
      {/* Dynamic Background Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#8877ee] via-transparent to-[#aa99ff] opacity-50 z-0"
      />

      {/* Floating orbs for depth */}
      <div
        className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-white/20 blur-[120px] pointer-events-none animate-pulse z-0"
        style={{ transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)` }}
      />

      {/* Parallax Hero Image (Bottom Up, Behind Content) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] flex justify-center z-0 pointer-events-none"
        style={{
          transform: `translate(-50%, ${scrollY * 0.2}px)`, // Parallax effect
        }}
      >
        {siteContent.heroImage ? (
          <img
            src={siteContent.heroImage}
            alt="Trin's Portfolio Masterpiece"
            className="w-auto h-[85vh] object-contain object-bottom drop-shadow-2xl opacity-90 filter saturate-[1.1]"
          />
        ) : (
          /* Placeholder if no image */
          <div className="w-[600px] h-[700px] bg-white/5 backdrop-blur-3xl rounded-t-full border-t border-x border-white/10 flex items-center justify-center">
            <ImageIcon className="w-20 h-20 text-white/20" />
          </div>
        )}
        {/* Gradient Overlay at bottom to blend image if needed */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#9988ff] to-transparent" />
      </div>

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

        {/* Center/Main Content Area - Empty again to push content down */}
        <div className="flex-1" />

        {/* Bottom Navigation / Bio & Socials (LEFT) */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 w-full">
          <div className="max-w-xs space-y-8 z-20">
            {/* Social Links */}
            <div className="flex gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
              <a href={siteContent.contactInstagram} className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Instagram</a>
              <a href={siteContent.bookingUrl} className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Book Now</a>
            </div>

            {/* Bio Text */}
            <p className="text-white/80 text-sm leading-relaxed font-light tracking-wide italic max-w-[280px]">
              {siteContent.heroBio}
            </p>
          </div>

          {/* Massive Headline (RIGHT -> NOW LEFT/CENTERED IN ITS OWN WAY or just LEFT?) */}
          {/* User said "not on righthand side". I will put it on the LEFT side of spacing, or maybe center it at the bottom? */}
          {/* Let's try placing it on the LEFT to balance the Bio? No, Bio is on Left. */}
          {/* If I put it on the Right, they hate it. if I put it Center-Screen, they hate it. */}
          {/* How about Center-Bottom? */}
          <div
            className="transition-transform duration-300 ease-out z-20 mix-blend-overlay w-full lg:w-auto text-center lg:text-right"
            style={{ transform: `translateX(${mousePosition.x * -10}px)` }}
          >
            <h1 className="font-serif text-[15vw] lg:text-[13vw] leading-[0.8] text-white tracking-tighter drop-shadow-sm">
              <span className="block">{siteContent.heroHeadlineTop}</span>
              <span className="block italic font-light opacity-90">{siteContent.heroHeadlineBottom}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 z-20">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>

      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30" />
    </section>
  )
}
