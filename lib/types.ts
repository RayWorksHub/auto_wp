export type Role = "user" | "admin"

export interface Account {
  id: string
  role: Role
  name: string
  email: string
  password: string
  verified: boolean
  companyId: string | null
  createdAt: string
}

export interface Company {
  id: string
  ownerId: string
  name: string
  taxNumber: string
  registrationNumber: string
  headquarters: string
  phone: string
  email: string
  website: string
  activity: string
  description: string
  contactName: string
  logoUrl: string | null
  createdAt: string
}

export interface ServiceItem {
  id: string
  title: string
  text: string
  price: string
}

export interface SiteProject {
  id: string
  ownerId: string
  companyId: string
  status: "draft" | "published"
  currentStep: number
  name: string
  slug: string
  template: "classic" | "modern" | "bold"
  primaryColor: string
  accentColor: string
  fontScale: number
  radius: number
  layout: "stacked" | "split"
  companyName: string
  activity: string
  shortDescription: string
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string | null
  logoUrl: string | null
  aboutImageUrl: string | null
  galleryUrls: string[]
  aboutTitle: string
  aboutText: string
  ctaText: string
  pages: {
    home: boolean
    about: boolean
    services: boolean
    references: boolean
    pricing: boolean
    contact: boolean
    blog: boolean
  }
  services: ServiceItem[]
  references: string[]
  contact: {
    phone: string
    email: string
    address: string
    hours: string
    showForm: boolean
  }
  updatedAt: string
  publishedAt: string | null
}

export interface Lesson {
  id: string
  order: number
  title: string
  duration: string
  description: string
  youtubeId: string | null
  youtubeUrl: string
  source: string
  keyPoints?: string[]
}

export interface CourseResource {
  filename: string
  kind: "pdf" | "csv"
  lines: string[]
}

export interface Course {
  id: string
  type: "startup" | "office" | "ai"
  product?: string
  title: string
  shortTitle?: string
  level: string
  duration: string
  description: string
  color: string
  status: "active" | "coming-soon"
  lessonCount: number
  lessons: Lesson[]
  downloadable: string | null
  resource?: CourseResource
}

export interface Faq {
  question: string
  answer: string
}

export interface PortalState {
  accounts: Account[]
  companies: Company[]
  projects: SiteProject[]
  progress: Record<string, Record<string, boolean>>
  currentUserId: string | null
}
