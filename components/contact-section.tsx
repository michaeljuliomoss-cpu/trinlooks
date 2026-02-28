"use client"

import { useState, useRef, type FormEvent, type MouseEvent } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"

export function ContactSection() {
  const portfolio = usePortfolio()
  const siteContent = portfolio?.siteContent

  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [buttonTransform, setButtonTransform] = useState({ rotateX: 0, rotateY: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const sendEmail = useAction(api.emails.sendContactEmail)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState("loading")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const service = formData.get("service") as string || "general"
    const message = formData.get("message") as string

    try {
      const result = await sendEmail({ name, email, service, message })
      if (result.success) {
        setFormState("success")
          ; (e.target as HTMLFormElement).reset()
      } else {
        setFormState("error")
      }
    } catch (error) {
      console.error(error)
      setFormState("error")
    }

    setTimeout(() => {
      if (formState !== "loading") setFormState("idle")
    }, 5000)
  }

  const handleButtonMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 3
    const rotateX = (y - centerY) / 8
    const rotateY = (centerX - x) / 8
    setButtonTransform({ rotateX, rotateY })
  }

  const handleButtonMouseLeave = () => {
    setButtonTransform({ rotateX: 0, rotateY: 0 })
  }

  if (!siteContent) return null

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div>
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Get in Touch</p>
            <h2 className="font-serif text-5xl md:text-6xl text-foreground mb-6 leading-tight">
              {siteContent.contactTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              {siteContent.contactSubtitle}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all duration-300">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Location</p>
                <p className="text-foreground font-serif text-lg">{siteContent.contactAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all duration-300">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Email</p>
                <p className="text-foreground font-serif text-lg">{siteContent.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all duration-300">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Instagram</p>
                <p className="text-foreground font-serif text-lg">@{siteContent.instagramHandle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-accent/5 blur-2xl rounded-3xl -z-10" />
          <form onSubmit={handleSubmit} className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 space-y-6 shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-medium text-foreground/80 ml-1">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 rounded-xl transition-all h-12 px-4 text-base"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80 ml-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  className="bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 rounded-xl transition-all h-12 px-4 text-base"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="service" className="text-sm font-medium text-foreground/80 ml-1">
                Requested Service
              </label>
              <Select name="service">
                <SelectTrigger className="bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 rounded-xl h-12 px-4 text-base">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 border-white/10 backdrop-blur-md rounded-xl">
                  <SelectItem value="editorial">Editorial Makeup</SelectItem>
                  <SelectItem value="beauty">Beauty & Glamour</SelectItem>
                  <SelectItem value="collaboration">Creative Collaboration</SelectItem>
                  <SelectItem value="agency">Agency Inquiry</SelectItem>
                  <SelectItem value="other">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-medium text-foreground/80 ml-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your vision or project..."
                rows={6}
                required
                className="bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 resize-none rounded-xl transition-all p-4 text-base"
              />
            </div>

            <div className="perspective-1000 mt-4">
              <Button
                ref={buttonRef}
                type="submit"
                size="lg"
                onMouseMove={handleButtonMouseMove}
                onMouseLeave={handleButtonMouseLeave}
                className="w-full h-14 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 shadow-xl shadow-accent/20 rounded-xl font-serif text-xl tracking-wide group disabled:opacity-50"
                style={{
                  transform: `rotateX(${buttonTransform.rotateX}deg) rotateY(${buttonTransform.rotateY}deg)`,
                }}
                disabled={formState === "loading"}
              >
                {formState === "loading" ? "Sending..." : "Send Inquiry"}
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </div>

            {formState === "success" && (
              <div className="flex items-center gap-3 text-green-400 justify-center p-4 bg-green-400/10 rounded-xl border border-green-400/20">
                <CheckCircle size={18} />
                <span className="font-medium">Message sent successfully!</span>
              </div>
            )}
            {formState === "error" && (
              <div className="flex items-center gap-3 text-destructive justify-center p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                <AlertCircle size={18} />
                <span className="font-medium">Something went wrong. Please try again.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
