"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { PortfolioCategory } from "@/lib/portfolio-data"
import { ImageIcon } from "lucide-react"

interface PortfolioCardProps {
  category: PortfolioCategory
  onClick: () => void
  index: number
}

export function PortfolioCard({ category, onClick, index }: PortfolioCardProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    setTransform({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer perspective-1000"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 ease-out border border-white/5 ring-1 ring-white/10 group-hover:ring-accent/30 shadow-xl"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 bg-card">
          {category.coverImage ? (
            <img
              src={category.coverImage || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Dynamic Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Accent Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="font-serif text-2xl text-white mb-2 leading-tight">
              {category.name}
            </h3>
            <p className="text-sm text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 italic">
              View Collection
            </p>
          </div>
        </div>

        {/* Reflective Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
