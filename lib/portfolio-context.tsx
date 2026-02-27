"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import {
  PortfolioImage,
  PortfolioCategory,
  Service,
  SiteContent,
  defaultSiteContent,
} from "./portfolio-data"

interface PortfolioContextType {
  categories: PortfolioCategory[]
  portfolioImages: PortfolioImage[]
  services: Service[]
  siteContent: SiteContent
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
  updateSiteContent: (updates: Partial<SiteContent>) => void
  updateCategory: (category: PortfolioCategory) => void
  updateService: (service: Service) => void
  addImage: (image: PortfolioImage) => void
  deleteImage: (id: string) => void
  addCategory: (category: PortfolioCategory) => void
  deleteCategory: (id: string) => void
  addService: (service: Partial<Service>) => void
  deleteService: (id: string) => void
  generateUploadUrl: () => Promise<string>
  getImageUrl: (storageId: string) => Promise<string | null>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Convex queries
  const categoriesQuery = useQuery(api.siteContent.getCategories)
  const imagesQuery = useQuery(api.siteContent.getImages)
  const servicesQuery = useQuery(api.siteContent.getServices)
  const siteContentQuery = useQuery(api.siteContent.getSiteContent)

  // Convex mutations
  const updateSiteContentMutation = useMutation(api.siteContent.updateSiteContent)
  const updateCategoryMutation = useMutation(api.siteContent.updateCategory)
  const updateServiceMutation = useMutation(api.siteContent.updateService)
  const addImageMutation = useMutation(api.siteContent.addImage)
  const deleteImageMutation = useMutation(api.siteContent.deleteImage)
  const addCategoryMutation = useMutation(api.siteContent.addCategory)
  const addServiceMutation = useMutation(api.siteContent.addService)
  const deleteServiceMutation = useMutation(api.siteContent.deleteService)

  const [isAdmin, setIsAdmin] = useState(false)

  // Transform Convex data to our local interfaces
  const categories = categoriesQuery || []
  const portfolioImages = imagesQuery || []
  const services = servicesQuery || []

  // Combine site content from k/v pairs into an object
  const siteContent: SiteContent = { ...defaultSiteContent }
  if (siteContentQuery) {
    siteContentQuery.forEach((item: any) => {
      if (item.key in siteContent) {
        (siteContent as any)[item.key] = item.value
      }
    })
  }

  const updateSiteContent = async (updates: Partial<SiteContent>) => {
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await updateSiteContentMutation({ key, value })
      }
    }
  }

  const updateCategory = async (category: PortfolioCategory) => {
    await updateCategoryMutation(category)
  }

  const addCategory = async (category: PortfolioCategory) => {
    await addCategoryMutation(category)
  }

  const deleteCategoryMutation = useMutation(api.siteContent.deleteCategory)

  const deleteCategory = async (id: string) => {
    await deleteCategoryMutation({ id })
  }

  const updateService = async (service: Service) => {
    await updateServiceMutation(service)
  }

  const addService = async (service: Partial<Service>) => {
    await addServiceMutation(service as any)
  }

  const deleteService = async (id: string) => {
    await deleteServiceMutation({ id })
  }

  const addImage = async (image: PortfolioImage) => {
    await addImageMutation(image)
  }

  const deleteImage = async (id: string) => {
    await deleteImageMutation({ id })
  }

  const generateUploadUrlMutation = useMutation(api.siteContent.generateUploadUrl)
  const getImageUrlMutation = useMutation(api.siteContent.getImageUrl)

  const generateUploadUrl = async () => {
    return await generateUploadUrlMutation()
  }

  const getImageUrl = async (storageId: any) => {
    return await getImageUrlMutation({ storageId })
  }

  return (
    <PortfolioContext.Provider
      value={{
        categories,
        portfolioImages,
        services,
        siteContent,
        isAdmin,
        setIsAdmin,
        updateSiteContent,
        updateCategory,
        updateService,
        addImage,
        deleteImage,
        addCategory,
        deleteCategory,
        addService,
        deleteService,
        generateUploadUrl,
        getImageUrl,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}
