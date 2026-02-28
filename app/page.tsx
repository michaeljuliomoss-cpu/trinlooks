"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { PortfolioGallery } from "@/components/portfolio-gallery"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Shortened Portfolio Preview */}
      <PortfolioOverview onCategoryClick={setSelectedCategory} />
      {selectedCategory && <PortfolioGallery categoryId={selectedCategory} onClose={() => setSelectedCategory(null)} />}
      <div className="flex justify-center pb-24 bg-background">
        <Link href="/portfolio">
          <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Services Teaser */}
      <section className="py-24 bg-card/30 border-t border-b border-border text-center px-6">
        <h2 className="font-serif text-4xl mb-6">Elevate Your Vision</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
          From high-fashion editorial sets to personalized beauty transformations, I offer a range of specialized services designed to bring your unique vision to life with precision and artistry.
        </p>
        <Link href="/services">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Explore Services <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      <Footer />
    </main>
  )
}
