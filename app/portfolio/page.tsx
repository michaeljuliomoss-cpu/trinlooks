"use client"

import { useState } from "react"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { PortfolioGallery } from "@/components/portfolio-gallery"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PortfolioPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    return (
        <main className="min-h-screen pt-20">
            <Navbar />
            <div className="py-12">
                <PortfolioOverview onCategoryClick={setSelectedCategory} />
                {selectedCategory && (
                    <PortfolioGallery
                        categoryId={selectedCategory}
                        onClose={() => setSelectedCategory(null)}
                    />
                )}
            </div>
            <Footer />
        </main>
    )
}
