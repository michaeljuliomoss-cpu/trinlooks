"use client"

import type React from "react"

import { useState, useRef } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { X } from "lucide-react"
import type { PortfolioImage } from "@/lib/portfolio-data"

interface GalleryImageProps {
  image: PortfolioImage
  index: number
}

function GalleryImage({ image, index }: GalleryImageProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    setTransform({ rotateX, rotateY, scale: 1.02 })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
  }

  return (
    <div
      ref={imageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="relative aspect-[4/5] rounded-lg overflow-hidden transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <img src={image.imageUrl || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-background">
          <h4 className="font-serif text-lg">{image.title}</h4>
          <p className="text-sm text-background/70">{image.description}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-background/50">
            <span>{image.role}</span>
            <span>{image.year}</span>
          </div>
        </div>

        {/* Dynamic shadow */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-300"
          style={{
            boxShadow:
              transform.scale > 1
                ? `${transform.rotateY * 1.5}px ${transform.rotateX * 1.5}px 30px rgba(0,0,0,0.25)`
                : "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  )
}

interface PortfolioGalleryProps {
  categoryId: string
  onClose: () => void
}

export function PortfolioGallery({ categoryId, onClose }: PortfolioGalleryProps) {
  const { categories, images } = usePortfolio()
  const category = categories.find((c) => c.id === categoryId)
  const categoryImages = images.filter((img) => img.categoryId === categoryId)

  if (!category) return null

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Gallery header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-2">Gallery</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{category.name}</h2>
            <p className="text-muted-foreground mt-2">{category.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close gallery"
          >
            <X size={24} className="text-muted-foreground" />
          </button>
        </div>

        {/* Image grid */}
        {categoryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryImages.map((image, index) => (
              <GalleryImage key={image.id} image={image} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">No images in this gallery yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Add images via the Admin Panel</p>
          </div>
        )}
      </div>
    </section>
  )
}
