import Link from "next/link"
import { Instagram, Mail, Send, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 bg-background border-t border-border overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[oklch(0.4_0.12_300)] blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent blur-[120px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="font-serif text-3xl tracking-tight text-foreground block">
              Trin's <span className="text-accent">Looks</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Elevating beauty through precision and passion. Crafting editorial-grade looks for every occasion.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/trinslooks"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/20 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:hello@trinslooks.com"
                className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/20 transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">About Me</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent mt-0.5" />
                <span>Gladstone Road, Nassau, New Providence</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent" />
                <span>(242) 825-3035</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent" />
                <span>trinityfeaste2@icloud.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg text-foreground mb-4">Stay Inspired</h4>
            <p className="text-sm text-muted-foreground">Subscribe for beauty tips, editorial updates, and booking availability.</p>
            <form className="flex gap-2">
              <Input
                placeholder="Email address"
                className="bg-card/50 border-border focus:ring-accent/20 h-11"
              />
              <Button size="icon" className="h-11 w-11 shrink-0 bg-accent hover:bg-accent/90">
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Trin's Looks. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
