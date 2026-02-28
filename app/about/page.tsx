import { AboutSection } from "@/components/about-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-20">
            <Navbar />
            <div className="py-12">
                <AboutSection />
            </div>
            <Footer />
        </main>
    )
}
