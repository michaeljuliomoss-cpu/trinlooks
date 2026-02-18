"use client"

import { useState, useRef, type MouseEvent } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"
import { Clock, DollarSign } from "lucide-react"

interface ServiceCardProps {
  id: string
  name: string
  description: string
  duration: string
  price: string
  index: number
  onBookNow: (serviceId: string) => void
}

function ServiceCard({ id, name, description, duration, price, index, onBookNow }: ServiceCardProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, lift: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25
    setTransform({ rotateX, rotateY, lift: 8 })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, lift: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group perspective-1000"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="relative bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 transition-all duration-500 ease-out h-full flex flex-col group-hover:border-accent/40 group-hover:bg-card/60"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateY(-${transform.lift}px)`,
          boxShadow:
            transform.lift > 0
              ? `0 20px 40px -10px oklch(0.4 0.1 350 / 0.2)`
              : "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl" />

        <div className="relative z-10">
          <h3 className="font-serif text-2xl text-foreground mb-3 group-hover:text-accent transition-colors duration-300">{name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{description}</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock size={14} className="text-accent" />
              </div>
              {duration}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign size={14} className="text-accent" />
              </div>
              <span className="font-medium text-foreground">{price}</span>
            </span>
          </div>

          <Button
            onClick={() => onBookNow(id)}
            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 rounded-xl font-medium tracking-wide group-hover:scale-[1.02]"
          >
            Reserve Your Session
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ServicesSection() {
  const portfolio = usePortfolio()
  const siteContent = portfolio?.siteContent
  const services = portfolio?.services || []

  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>()

  const handleBookNow = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsBookingOpen(true)
  }

  if (!siteContent) return null

  return (
    <>
      <section id="services" className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />

        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-accent blur-[150px] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 right-0 w-[400px] h-[400px] bg-[oklch(0.4_0.12_300)] blur-[120px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Services</p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{siteContent.servicesTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {siteContent.servicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                duration={service.duration}
                price={service.price}
                index={index}
                onBookNow={handleBookNow}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don't see what you're looking for? Let's create something custom.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const contact = document.querySelector("#contact")
                if (contact) contact.scrollIntoView({ behavior: "smooth" })
              }}
              className="border-accent/40 text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedServiceId={selectedServiceId}
      />
    </>
  )
}
