// Portfolio data store - this can be connected to a real backend later (Firebase/Supabase)
// For now, we use React state to manage this data

export interface PortfolioImage {
  id: string
  categoryId: string
  imageUrl: string
  title: string
  description: string
  role: string
  year: string
}

export interface PortfolioCategory {
  id: string
  name: string
  description: string
  coverImage: string
}

export interface Service {
  id: string
  name: string
  description: string
  duration: string
  price: string
}

export interface SiteContent {
  // Hero section
  heroImage: string
  heroHeadlineTop: string
  heroHeadlineBottom: string
  heroBio: string
  heroLocation: string

  // About section
  aboutPortrait: string
  aboutTitle: string
  aboutSubtitle: string
  aboutDescription1: string
  aboutDescription2: string

  // Services section
  servicesTitle: string
  servicesDescription: string

  // Contact section
  contactTitle: string
  contactDescription: string
  contactEmail: string
  contactInstagram: string
  contactLocation: string

  // Global
  bookingUrl: string
}

// Default categories
export const defaultCategories: PortfolioCategory[] = [
  {
    id: "beauty-glam",
    name: "Beauty & Glam",
    description: "Exquisite makeup artistry that highlights your natural radiance for any high-profile event.",
    coverImage: "/images/portfolio/beauty-glam-cover.jpg",
  },
  {
    id: "editorial-noir",
    name: "Editorial Noir",
    description: "Avant-garde and cinematic concepts that push the boundaries of traditional beauty.",
    coverImage: "/images/portfolio/editorial-noir-cover.jpg",
  },
  {
    id: "soft-natural",
    name: "Soft Natural",
    description: "Effortless, 'no-makeup' looks that emphasize skin health and organic textures.",
    coverImage: "/images/portfolio/soft-natural-cover.jpg",
  },
  {
    id: "creative-concepts",
    name: "Creative Concepts",
    description: "Bold, artistic expressions and conceptual styling for visionary projects.",
    coverImage: "/images/portfolio/creative-concepts-cover.jpg",
  },
  {
    id: "campaigns-collabs",
    name: "Campaigns & Collabs",
    description: "Professional creative direction and styling for commercial brands and editorial features.",
    coverImage: "/images/portfolio/campaigns-cover.jpg",
  },
]

// Default portfolio images - empty to start
export const defaultImages: PortfolioImage[] = []

export const defaultSiteContent: SiteContent = {
  heroImage: "/images/hero-portrait.jpg",
  heroHeadlineTop: "REDEFINING",
  heroHeadlineBottom: "BEAUTY",
  heroBio: "Multifaceted model and creative visionary based in London. Specializing in high-fashion editorial, commercial campaigns, and avant-garde beauty concepts.",
  heroLocation: "BASED IN LONDON • WORLDWIDE",

  aboutPortrait: "/images/about-portrait.jpg",
  aboutTitle: "TRINITY",
  aboutSubtitle: "THE VISIONARY BEHIND THE LOOKS",
  aboutDescription1: "With over 5 years of experience in the fashion and beauty industry, Trinity has established herself as a versatile model and a creative force. Her work is characterized by a unique blend of elegance, edge, and an innate ability to translate complex concepts into compelling visual narratives.",
  aboutDescription2: "Beyond modeling, Trinity's expertise extends to creative direction and professional makeup artistry, allowing her to provide a cohesive and holistic approach to every project she undertakes.",

  servicesTitle: "ELEVATE YOUR VISION",
  servicesDescription: "From high-fashion editorial sets to personalized beauty transformations, I offer a range of specialized services designed to bring your unique vision to life with precision and artistry.",

  contactTitle: "START A CONVERSATION",
  contactDescription: "Have a project in mind or looking to collaborate? Reach out to discuss how we can create something extraordinary together.",
  contactEmail: "hello@trinlooks.com",
  contactInstagram: "@trinlooks",
  contactLocation: "London, UK & Available for Travel",

  bookingUrl: "https://booking.setmore.com/scheduleappointment/your-link-here",
}

// Default services
export const defaultServices: Service[] = [
  {
    id: "1",
    name: "The Signature Glow",
    description: "A refined, naturally enhanced look tailored for professional headshots and daytime sophistication.",
    duration: "60 min",
    price: "$120",
  },
  {
    id: "2",
    name: "The Red Carpet Glam",
    description: "A high-impact transformation featuring precision contouring and dramatic styling for evening galas.",
    duration: "90 min",
    price: "$185",
  },
  {
    id: "3",
    name: "The Editorial Masterclass",
    description: "High-fashion, camera-ready makeup and styling designed for editorial shoots and portfolio building.",
    duration: "2 hr",
    price: "$250",
  },
  {
    id: "4",
    name: "Creative Visionary Package",
    description: "Full-service creative direction, including concept storyboarding, styling, and makeup artistry.",
    duration: "4 hr",
    price: "Custom",
  },
  {
    id: "5",
    name: "Bridal Artistry",
    description: "Timeless, luxury bridal beauty. Includes a comprehensive consultation and a personalized day-of trial.",
    duration: "2.5 hr",
    price: "$450+",
  },
]
