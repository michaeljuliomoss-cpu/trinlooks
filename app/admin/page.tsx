"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { usePortfolio } from "@/lib/portfolio-context"
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
  Instagram,
  Phone,
  ArrowRight
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
    deleteImage
  } = usePortfolio()

  const [isAdmin, setIsAdmin] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [editContent, setEditContent] = useState(siteContent)
  const [activeTab, setActiveTab] = useState("hero")

  const handleLogin = (e: FormEvent) => {
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

  const handleContentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleUpdateServiceField = async (id: string, field: string, value: string) => {
    await updateService(id, { [field]: value })
  }

  const handleAddCategory = async () => {
    const title = prompt("Enter category title:")
    if (title) {
      const slug = title.toLowerCase().replace(/\s+/g, "-")
      await addCategory({ title, slug, coverImage: "/placeholder.svg" })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Delete this category?")) {
      await deleteCategory(id)
    }
  }

  const handleAddImage = async (category: string) => {
    const url = prompt("Enter image URL:")
    if (url) {
      await addImage({
        url,
        title: "New Photo",
        category
      })
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
        <Card className="w-full max-w-md shadow-2xl border-border/40 backdrop-blur-sm bg-card/80">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <Lock className="w-10 h-10 text-accent" />
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-background/50 border-border/50 h-11 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-background/50 border-border/50 h-11 focus:ring-accent/20"
                />
              </div>
              {loginError && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-center animate-pulse">{loginError}</p>}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-base font-medium shadow-lg shadow-accent/20 mt-4">
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/40 py-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
              Authorized Personnel Only
            </p>
          </CardFooter>
        </Card>
      </main>
    )
  }

  if (!siteContent || !editContent) return <div className="min-h-screen bg-background flex items-center justify-center font-serif text-2xl tracking-widest text-accent animate-pulse">Loading CMS Data...</div>

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20">
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
                { val: "hero", icon: Layout, label: "Hero" },
                { val: "about", icon: User, label: "About" },
                { val: "services", icon: Briefcase, label: "Services" },
                { val: "portfolio", icon: ImageIcon, label: "Portfolio" },
                { val: "contact", icon: Mail, label: "Contact" },
                { val: "settings", icon: Settings, label: "Settings" }
              ].map(tab => (
                <TabsTrigger
                  key={tab.val}
                  value={tab.val}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-accent px-4 py-2 flex items-center gap-2 rounded-md transition-all h-10"
                >
                  <tab.icon size={16} /> {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <Button onClick={handleSaveSiteContent} className="items-center gap-2 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 px-8 h-11 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Save size={18} /> Publish Content
            </Button>
          </div>

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
                      <Input name="heroTitle" value={editContent.heroTitle} onChange={handleContentChange} className="bg-muted/10 font-serif text-2xl h-14" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Subtitle</label>
                      <Textarea name="heroSubtitle" value={editContent.heroSubtitle} onChange={handleContentChange} className="bg-muted/10 text-lg leading-relaxed h-32" />
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
                    <div className="aspect-square rounded-xl overflow-hidden border border-border shadow-inner bg-muted/50">
                      <img src={editContent.heroImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Input name="heroImage" value={editContent.heroImage} onChange={handleContentChange} placeholder="Image URL" className="bg-muted/10 h-10" />
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
                    <Input name="aboutImage" value={editContent.aboutImage} onChange={handleContentChange} placeholder="Portrait URL" className="bg-muted/10 h-10" />
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
                  {services.map((service, index) => (
                    <div key={service.id || index} className="p-8 hover:bg-muted/5 transition-colors group">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2 space-y-4">
                          <Input
                            value={service.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateServiceField(service.id, "name", e.target.value)}
                            className="bg-muted/10 font-serif text-lg h-11 font-medium"
                            placeholder="Service Name"
                          />
                          <Textarea
                            value={service.description}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleUpdateServiceField(service.id, "description", e.target.value)}
                            className="bg-muted/10 h-24 text-sm"
                            placeholder="Description"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-accent" />
                            <Input
                              value={service.duration}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateServiceField(service.id, "duration", e.target.value)}
                              className="bg-muted/10 h-10 text-sm"
                              placeholder="Duration"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <DollarSign size={16} className="text-accent" />
                            <Input
                              value={service.price}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateServiceField(service.id, "price", e.target.value)}
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
              {categories.map((cat, idx) => (
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
                      <p className="font-medium text-lg mb-1">{cat.title}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{cat.slug}</p>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none">{portfolioImages.filter(img => img.category === cat.slug).length} Photos</Badge>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="ghost"
                      className="w-full border border-border/50 text-xs h-8 gap-2 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleAddImage(cat.slug)}
                    >
                      <Plus size={14} /> Add Image
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Separator className="bg-border/40 my-10" />

            <div className="space-y-8">
              <h3 className="font-serif text-2xl">Recent Photo Management</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {portfolioImages.slice(0, 12).map((img, idx) => (
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
