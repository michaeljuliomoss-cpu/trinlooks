import { ContactSection } from "@/components/contact-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-20">
            <Navbar />
            <div className="py-12">
                <ContactSection />
            </div>
            <Footer />
        </main>
    )
}
