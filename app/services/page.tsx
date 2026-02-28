import { ServicesSection } from "@/components/services-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ServicesPage() {
    return (
        <main className="min-h-screen pt-20">
            <Navbar />
            <div className="py-12">
                <ServicesSection />
            </div>
            <Footer />
        </main>
    )
}
