"use client"

import React, { useState } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Layout,
  User,
  Briefcase,
  Image as ImageIcon,
  Mail,
  Settings,
  Save,
  LogOut,
  Plus,
  Trash2,
  ChevronRight,
  Lock,
  Globe,
  Phone,
  ArrowRight,
  Clock,
  Upload,
  Instagram,
  CalendarRange,
  CheckCircle,
  XCircle,
  Palette,
  RotateCcw
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function AdminPage() {
  const {
    siteContent,
    portfolioImages,
    categories,
    services,
    updateSiteContent,
    addService,
    deleteService,
    updateService,
    addCategory,
    deleteCategory,
    addImage,
    deleteImage,
    generateUploadUrl,
    getImageUrl
  } = usePortfolio()

  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [editContent, setEditContent] = useState(siteContent)
  const [activeTab, setActiveTab] = useState("appointments")
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null)

  // Theme color state
  const defaultThemeColors = {
    primary: "#D4AF37",
    accent: "#C97B5A",
    background: "#0B0114",
    card: "#1A0A2E",
    secondary: "#1F0535",
  }
  const [themeColors, setThemeColors] = useState(
    siteContent?.themeColors || defaultThemeColors
  )

  const handleColorChange = (key: string, value: string) => {
    const updated = { ...themeColors, [key]: value }
    setThemeColors(updated)
    if (editContent) {
      setEditContent({ ...editContent, themeColors: updated })
    }
    // Live preview: apply immediately to document
    const html = document.documentElement
    const propMap: Record<string, string[]> = {
      primary: ["--primary", "--color-primary", "--ring", "--color-ring"],
      accent: ["--accent", "--color-accent"],
      background: ["--background", "--color-background"],
      card: ["--card", "--color-card", "--popover", "--color-popover"],
      secondary: ["--secondary", "--color-secondary", "--muted", "--color-muted", "--input", "--color-input"],
    }
    if (propMap[key]) {
      propMap[key].forEach(prop => html.style.setProperty(prop, value))
    }
  }

  const handleResetColors = () => {
    setThemeColors(defaultThemeColors)
    if (editContent) {
      setEditContent({ ...editContent, themeColors: defaultThemeColors })
    }
    // Remove all inline overrides
    const html = document.documentElement
    const allProps = [
      "--background", "--color-background",
      "--card", "--color-card", "--popover", "--color-popover",
      "--primary", "--color-primary", "--ring", "--color-ring",
      "--accent", "--color-accent",
      "--secondary", "--color-secondary", "--muted", "--color-muted",
      "--input", "--color-input", "--border", "--color-border",
    ]
    allProps.forEach(prop => html.style.removeProperty(prop))
  }

  const presetPalettes = [
    { name: "Royal Purple", colors: { primary: "#D4AF37", accent: "#C97B5A", background: "#0B0114", card: "#1A0A2E", secondary: "#1F0535" } },
    { name: "Ocean Blue", colors: { primary: "#50C4ED", accent: "#387ADF", background: "#060D1F", card: "#0D1B3E", secondary: "#1A2744" } },
    { name: "Rose Gold", colors: { primary: "#E8B4B8", accent: "#C9A96E", background: "#1A0A0E", card: "#2E1520", secondary: "#351A28" } },
    { name: "Midnight Green", colors: { primary: "#50FA7B", accent: "#8BE9FD", background: "#0A1612", card: "#142E24", secondary: "#1A3B2E" } },
    { name: "Sunset Flame", colors: { primary: "#FF6B35", accent: "#FFB347", background: "#1A0A06", card: "#2E1A10", secondary: "#351F14" } },
    { name: "Neon Pink", colors: { primary: "#FF10F0", accent: "#FF69B4", background: "#0A0612", card: "#1A102E", secondary: "#211535" } },
  ]

  const appointments = useQuery(api.appointments.getAppointments) || []
  const confirmAppointment = useMutation(api.appointments.confirmAppointment)
  const cancelAppointment = useMutation(api.appointments.cancelAppointment)
  const completeAppointment = useMutation(api.appointments.completeAppointment)
  const deleteAppointment = useMutation(api.appointments.deleteAppointment)

  const sortedAppointments = [...appointments].sort((a, b) => {
    return a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot)
  })

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (username === "TrinTrin" && password === "Googoogaga12") {
      setIsAdmin(true)
      setLoginError("")
    } else {
      setLoginError("Invalid credentials. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setUsername("")
    setPassword("")
  }

  const handleSaveSiteContent = async () => {
    if (editContent) {
      await updateSiteContent(editContent)
      alert("Site content updated successfully!")
    }
  }

  const handleContentChange = (e: any) => {
    const { name, value } = e.target
    if (editContent) {
      setEditContent({ ...editContent, [name]: value })
    }
  }

  const handleAddService = async () => {
    const name = prompt("Enter service name:")
    if (name) {
      await addService({
        name,
        description: "New service description",
        duration: "60 mins",
        price: "$100"
      })
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id)
    }
  }

  const handleUpdateServiceField = async (id: string, field: keyof typeof services[0], value: string) => {
    const serviceToUpdate = services.find((s: any) => s.id === id)
    if (serviceToUpdate) {
      await updateService({ ...serviceToUpdate, [field]: value })
    }
  }

  const handleAddCategory = async () => {
    const name = prompt("Enter category title:")
    if (name) {
      const id = name.toLowerCase().replace(/\s+/g, "-")
      await addCategory({ id, name, description: "New Category", coverImage: "/placeholder.svg" })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Delete this category?")) {
      await deleteCategory(id)
    }
  }

  const handleAddImage = async (category: string) => {
    const url = prompt("Enter external image URL (or use the upload button):")
    if (url) {
      await addImage({
        url,
        title: "New Photo",
        category,
        categoryId: category,
        imageUrl: url,
        description: "",
        role: "",
        year: ""
      } as any)
    }
  }

  const handlePortfolioImageUpload = async (e: any, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingCategory(category);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const url = await getImageUrl(storageId);
      if (url) {
        await addImage({
          url,
          title: "New Photo",
          category,
          categoryId: category,
          imageUrl: url,
          description: "",
          role: "",
          year: ""
        } as any);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploadingCategory(null);
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (confirm("Delete this image?")) {
      await deleteImage(id)
    }
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-accent/5">
        <Card className="w-full max-w-md shadow-2xl border-border/40 backdrop-blur-xl bg-card/60">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-serif text-3xl tracking-tight">Admin Access</CardTitle>
            <CardDescription className="text-base text-muted-foreground/80">Secure login for Trin&apos;s Looks CMS</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Username</label>
                <Input
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-background/50 border-border/50 h-11 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-background/50 border-border/50 h-11 focus:ring-accent/20"
                />
              </div>
              {loginError && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center animate-pulse">{loginError}</p>}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-medium shadow-lg shadow-primary/20 mt-4">
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/40 py-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              Authorized Personnel Only
            </p>
          </CardFooter>
        </Card>
      </main>
    )
  }

  if (!siteContent || !editContent) return <div className="min-h-screen bg-background flex items-center justify-center font-serif text-2xl tracking-widest text-primary animate-pulse">Loading CMS Data...</div>

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <Layout size={20} />
            </div>
            <div>
              <h1 className="font-serif text-xl tracking-tight leading-none mb-1">CMS Control</h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Dashboard Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('/', '_blank')}
              className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Globe size={16} /> View Site
            </Button>
            <Separator orientation="vertical" className="h-4 bg-border/60 mx-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 gap-2"
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Tabs defaultValue="hero" value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/40 pb-6">
            <TabsList className="bg-muted/30 p-1 border border-border/30 backdrop-blur-sm h-auto flex flex-wrap gap-1 w-full sm:w-auto">
              {[
                { val: "appointments", icon: CalendarRange, label: "Appointments" },
                { val: "hero", icon: Layout, label: "Hero" },
                { val: "about", icon: User, label: "About" },
                { val: "services", icon: Briefcase, label: "Services" },
                { val: "portfolio", icon: ImageIcon, label: "Portfolio" },
                { val: "contact", icon: Mail, label: "Contact" },
                { val: "appearance", icon: Palette, label: "Appearance" },
                { val: "settings", icon: Settings, label: "Settings" }
              ].map(tab => (
                <TabsTrigger
                  key={tab.val}
                  value={tab.val}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary px-4 py-2 flex items-center gap-2 rounded-md transition-all h-10"
                >
                  <tab.icon size={16} /> {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <Button onClick={handleSaveSiteContent} className="items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 h-11 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Save size={18} /> Publish Content
            </Button>
          </div>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-2xl">Manage Appointments</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sortedAppointments.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-xl border border-border/40">
                  <CalendarRange className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No appointments booked yet.</p>
                </div>
              ) : (
                sortedAppointments.map((app) => (
                  <Card key={app._id} className={`border-border/40 shadow-sm overflow-hidden ${app.status === 'completed' || app.status === 'cancelled' ? 'opacity-60' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-serif text-xl">{app.customerName}</h4>
                          <Badge variant="outline" className={
                            app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                              app.status === 'confirmed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                app.status === 'completed' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                  'bg-red-500/10 text-red-600 border-red-500/20'
                          }>
                            {app.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-accent">Service: {services.find(s => s.id === app.serviceId)?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock size={14} /> {app.date} at {app.timeSlot} ({app.duration})
                        </p>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 pt-2">
                          <span className="flex items-center gap-1.5"><Mail size={14} /> {app.customerEmail}</span>
                          <span className="flex items-center gap-1.5"><Phone size={14} /> {app.customerPhone}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {app.status === 'pending' && (
                          <>
                            <Button onClick={() => confirmAppointment({ id: app._id })} className="bg-green-600 hover:bg-green-700 text-white gap-2 h-9">
                              <CheckCircle size={16} /> Confirm
                            </Button>
                            <Button onClick={() => cancelAppointment({ id: app._id })} variant="destructive" className="gap-2 h-9">
                              <XCircle size={16} /> Decline
                            </Button>
                          </>
                        )}
                        {app.status === 'confirmed' && (
                          <Button onClick={() => completeAppointment({ id: app._id })} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9">
                            <CheckCircle size={16} /> Mark Completed
                          </Button>
                        )}
                        <Button onClick={() => deleteAppointment({ id: app._id })} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Hero Tab */}
          <TabsContent value="hero" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-border/40 shadow-sm overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ArrowRight className="text-accent" size={18} /> Hero Text Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Title</label>
                      <Input name="heroHeadlineTop" value={editContent.heroHeadlineTop} onChange={handleContentChange} className="bg-muted/10 font-serif text-2xl h-14" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Subtitle</label>
                      <Textarea name="heroHeadlineBottom" value={editContent.heroHeadlineBottom} onChange={handleContentChange} className="bg-muted/10 text-lg leading-relaxed h-32" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-8">
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="text-accent" size={18} /> Hero Featured Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="aspect-square rounded-xl overflow-hidden border border-border shadow-inner bg-muted/50 relative group">
                      <img src={editContent.heroImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <ImageUploadInput
                      value={editContent.heroImage}
                      onChange={(url) => setEditContent({ ...editContent, heroImage: url })}
                      generateUploadUrl={generateUploadUrl}
                      getImageUrl={getImageUrl}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg">Biography & Mission</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">About Title</label>
                      <Input name="aboutTitle" value={editContent.aboutTitle} onChange={handleContentChange} className="bg-muted/10 font-serif text-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Story Content</label>
                      <Textarea name="aboutText" value={editContent.aboutText} onChange={handleContentChange} className="bg-muted/10 h-64 text-base leading-relaxed" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-8">
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg">About Portrait</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-inner">
                      <img src={editContent.aboutImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <ImageUploadInput
                      value={editContent.aboutImage}
                      onChange={(url) => setEditContent({ ...editContent, aboutImage: url })}
                      generateUploadUrl={generateUploadUrl}
                      getImageUrl={getImageUrl}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="bg-muted/20 border-b border-border/30 flex flex-row items-center justify-between py-5">
                <CardTitle className="text-lg">Available Services</CardTitle>
                <Button onClick={handleAddService} size="sm" className="bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border border-accent/20 gap-2 h-9">
                  <Plus size={16} /> Add New Service
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {services.map((service: any, index: number) => (
                    <div key={service.id || index} className="p-8 hover:bg-muted/5 transition-colors group">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <Input
                            value={service.name}
                            onChange={(e: any) => handleUpdateServiceField(service.id, "name", e.target.value)}
                            className="bg-muted/10 font-serif text-lg h-11 font-medium"
                            placeholder="Service Name"
                          />
                          <Textarea
                            value={service.description}
                            onChange={(e: any) => handleUpdateServiceField(service.id, "description", e.target.value)}
                            className="bg-muted/10 h-24 text-sm"
                            placeholder="Description"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-accent" />
                            <Input
                              value={service.duration}
                              onChange={(e: any) => handleUpdateServiceField(service.id, "duration", e.target.value)}
                              className="bg-muted/10 h-10 text-sm"
                              placeholder="Duration"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <DollarSign size={16} className="text-accent" />
                            <Input
                              value={service.price}
                              onChange={(e: any) => handleUpdateServiceField(service.id, "price", e.target.value)}
                              className="bg-muted/10 h-10 text-sm"
                              placeholder="Price"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end items-start pt-1">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-2xl">Project Categories</h3>
              <Button onClick={handleAddCategory} variant="outline" className="border-accent/40 text-accent hover:bg-accent/5 h-10 gap-2">
                <Plus size={18} /> New Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat: any, idx: number) => (
                <Card key={cat.id || idx} className="border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="aspect-[4/3] relative bg-muted animate-pulse group-hover:animate-none">
                    <img src={cat.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="scale-0 group-hover:scale-100 transition-transform">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lg mb-1">{cat.name}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{cat.id}</p>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none">{portfolioImages.filter((img: any) => img.categoryId === cat.id).length} Photos</Badge>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="w-full border border-border/50 text-xs h-8 gap-2 hover:bg-accent hover:text-accent-foreground relative overflow-hidden"
                    >
                      {uploadingCategory === cat.id ? (
                        <span className="animate-pulse">Uploading...</span>
                      ) : (
                        <>
                          <Upload size={14} /> Upload Image
                          <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e: any) => handlePortfolioImageUpload(e, cat.id)}
                          />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Separator className="bg-border/40 my-10" />

            <div className="space-y-8">
              <h3 className="font-serif text-2xl">Recent Photo Management</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {portfolioImages.slice(0, 12).map((img: any, idx: number) => (
                  <div key={img.id || idx} className="aspect-square relative rounded-lg overflow-hidden border border-border group">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                      <Badge className="pointer-events-none">{img.category}</Badge>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteImage(img.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contact & Social Tab */}
          <TabsContent value="contact" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card className="border-border/40 shadow-sm">
                <CardHeader className="bg-muted/20 border-b border-border/30">
                  <CardTitle className="text-lg">Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Contact Email</label>
                    <Input name="contactEmail" value={editContent.contactEmail} onChange={handleContentChange} className="bg-muted/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Address / Studio</label>
                    <Input name="contactAddress" value={editContent.contactAddress} onChange={handleContentChange} className="bg-muted/10 h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Phone (Optional)</label>
                    <Input name="contactPhone" value={editContent.contactPhone} onChange={handleContentChange} className="bg-muted/10 h-12" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 shadow-sm">
                <CardHeader className="bg-muted/20 border-b border-border/30">
                  <CardTitle className="text-lg">Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2"><Instagram size={14} /> Instagram Handle</label>
                    <div className="flex">
                      <span className="h-12 flex items-center px-4 bg-muted/20 border border-r-0 border-border/50 rounded-l-xl text-muted-foreground font-serif">@</span>
                      <Input name="instagramHandle" value={editContent.instagramHandle} onChange={handleContentChange} className="bg-muted/10 h-12 rounded-l-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-2">YouTube URL</label>
                    <Input name="youtubeUrl" value={editContent.youtubeUrl} onChange={handleContentChange} className="bg-muted/10 h-12" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Color Pickers */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Palette className="text-accent" size={18} /> Theme Colors
                    </CardTitle>
                    <CardDescription>Customize your website colors using the color wheel or by entering hex codes</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {[
                      { key: "primary", label: "Primary (Gold/Buttons)", desc: "Main action color for buttons, links, and highlights" },
                      { key: "accent", label: "Accent (Rose/Tags)", desc: "Secondary highlight color for badges, icons, and tags" },
                      { key: "background", label: "Background", desc: "The main page background color" },
                      { key: "card", label: "Card/Surface", desc: "Background color for cards, modals, and panels" },
                      { key: "secondary", label: "Secondary/Muted", desc: "Mid-tone color for subtle backgrounds and borders" },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center gap-6 p-4 rounded-xl border border-border/30 bg-card/50 hover:bg-card/80 transition-colors">
                        {/* Color Wheel */}
                        <div className="relative group">
                          <div
                            className="w-14 h-14 rounded-full border-2 border-border shadow-lg cursor-pointer overflow-hidden transition-transform hover:scale-110"
                            style={{ backgroundColor: themeColors[key as keyof typeof themeColors] }}
                          >
                            <input
                              type="color"
                              value={themeColors[key as keyof typeof themeColors]}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title={`Pick ${label}`}
                            />
                          </div>
                        </div>
                        {/* Info + Hex Input */}
                        <div className="flex-1 space-y-1">
                          <label className="text-sm font-semibold tracking-wide text-foreground">{label}</label>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                        {/* Hex Code Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">#</span>
                          <Input
                            value={themeColors[key as keyof typeof themeColors].replace("#", "")}
                            onChange={(e) => {
                              let val = e.target.value.replace(/[^a-fA-F0-9]/g, "").slice(0, 6)
                              if (val.length === 6) handleColorChange(key, `#${val}`)
                            }}
                            onBlur={(e) => {
                              let val = e.target.value.replace(/[^a-fA-F0-9]/g, "").slice(0, 6)
                              if (val.length === 6) handleColorChange(key, `#${val}`)
                            }}
                            maxLength={6}
                            className="bg-muted/10 h-9 w-24 text-xs font-mono uppercase tracking-wider text-center"
                            placeholder="D4AF37"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        onClick={handleResetColors}
                        variant="outline"
                        className="gap-2 border-border/50 text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw size={16} /> Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Preset Palettes */}
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg">Quick Presets</CardTitle>
                    <CardDescription>One-click theme presets to instantly transform your site</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {presetPalettes.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setThemeColors(preset.colors)
                            if (editContent) {
                              setEditContent({ ...editContent, themeColors: preset.colors })
                            }
                            // Apply immediately
                            const html = document.documentElement
                            const propMap: Record<string, string[]> = {
                              primary: ["--primary", "--color-primary", "--ring", "--color-ring"],
                              accent: ["--accent", "--color-accent"],
                              background: ["--background", "--color-background"],
                              card: ["--card", "--color-card", "--popover", "--color-popover"],
                              secondary: ["--secondary", "--color-secondary", "--muted", "--color-muted", "--input", "--color-input"],
                            }
                            Object.entries(preset.colors).forEach(([key, value]) => {
                              if (propMap[key]) propMap[key].forEach(prop => html.style.setProperty(prop, value))
                            })
                          }}
                          className="group p-4 rounded-xl border border-border/30 bg-card/50 hover:border-primary/50 hover:bg-card transition-all text-left"
                        >
                          <div className="flex gap-1.5 mb-3">
                            {Object.values(preset.colors).map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full border border-white/10 shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{preset.name}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Preview */}
              <div className="space-y-8">
                <Card className="border-border/40 shadow-sm sticky top-28">
                  <CardHeader className="bg-muted/20 border-b border-border/30">
                    <CardTitle className="text-lg">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {/* Mini preview card */}
                    <div
                      className="rounded-xl p-5 border space-y-4 transition-colors duration-300"
                      style={{ backgroundColor: themeColors.card, borderColor: themeColors.secondary }}
                    >
                      <div className="space-y-2">
                        <h4 className="font-serif text-lg" style={{ color: "#f5f5f5" }}>Trin&apos;s Looks</h4>
                        <p className="text-xs" style={{ color: "#999" }}>Preview of your color choices</p>
                      </div>
                      <div
                        className="rounded-lg px-4 py-2.5 text-sm font-medium text-center transition-colors"
                        style={{ backgroundColor: themeColors.primary, color: themeColors.background }}
                      >
                        Book Now
                      </div>
                      <div
                        className="rounded-lg px-4 py-2.5 text-sm text-center border transition-colors"
                        style={{ borderColor: themeColors.accent, color: themeColors.accent }}
                      >
                        View Portfolio
                      </div>
                      <div className="flex gap-2">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: themeColors.accent + "20", color: themeColors.accent }}
                        >
                          Beauty
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: themeColors.primary + "20", color: themeColors.primary }}
                        >
                          Editorial
                        </span>
                      </div>
                    </div>

                    {/* Page background preview */}
                    <div
                      className="rounded-xl p-4 border transition-colors duration-300"
                      style={{ backgroundColor: themeColors.background, borderColor: themeColors.secondary }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: themeColors.primary }} />
                        <div className="space-y-1">
                          <div className="h-2 w-20 rounded" style={{ backgroundColor: themeColors.accent }} />
                          <div className="h-2 w-14 rounded" style={{ backgroundColor: themeColors.secondary }} />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Changes preview live. Click &quot;Publish Content&quot; to save.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="bg-muted/20 border-b border-border/30">
                <CardTitle className="text-lg">Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div className="max-w-md space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Notification Email</label>
                    <Input placeholder="admin@trinlooks.com" className="bg-muted/10 h-12" />
                    <p className="text-xs text-muted-foreground">Email for booking notifications and contact form submissions.</p>
                  </div>

                  <Separator className="bg-border/40" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Temporarily disable site access</p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-muted border border-border" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Search Visibility</p>
                      <p className="text-sm text-muted-foreground">Allow search engines to index site</p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-green-500 border border-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">&copy; {new Date().getFullYear()} Trin&apos;s Looks CMS &bull; Built with Convex & Next.js</p>
      </footer>
    </main>
  )
}

function DollarSign({ size, className }: { size: number, className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function ImageUploadInput({ value, onChange, generateUploadUrl, getImageUrl }: { value: string, onChange: (url: string) => void, generateUploadUrl: any, getImageUrl: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      const url = await getImageUrl(storageId);
      if (url) {
        onChange(url);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} className="text-sm cursor-pointer file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground file:border-0 file:rounded-md cursor-pointer file:h-full py-1 h-9" />
        {isUploading && <span className="text-xs text-muted-foreground animate-pulse whitespace-nowrap font-medium">Uploading...</span>}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest px-2">OR</div>
        <Input value={value} onChange={(e: any) => onChange(e.target.value)} placeholder="Paste image URL here" className="bg-muted/10 h-9 text-xs flex-1" />
      </div>
    </div>
  );
}
