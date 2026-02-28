"use client"

import { usePortfolio } from "@/lib/portfolio-context"
import { PortfolioCard } from "./portfolio-card"

interface PortfolioOverviewProps {
  onCategoryClick: (categoryId: string) => void
}

export function PortfolioOverview({ onCategoryClick }: PortfolioOverviewProps) {
  const { categories } = usePortfolio()

  return (
    <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* Subtle purple glow accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary blur-[250px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary blur-[200px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Portfolio</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Editorial Portfolio</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore collections spanning beauty, editorial, and creative artistry. Click any category to view the full
            gallery.
          </p>
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <PortfolioCard
              key={category.id}
              category={category}
              index={index}
              onClick={() => onCategoryClick(category.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
