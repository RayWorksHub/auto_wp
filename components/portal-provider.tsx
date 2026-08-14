"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Account, Company, PortalState, SiteProject } from "@/lib/types"
import { ALL_COURSES, buildInitialState, STORAGE_KEY } from "@/lib/seed"

interface LadderMetric {
  key: "profile" | "website" | "education" | "presence"
  label: string
  value: number
}

interface LadderResult {
  score: number
  level: number
  levelLabel: string
  nextLabel: string | null
  metrics: LadderMetric[]
}

interface PortalContextValue {
  ready: boolean
  state: PortalState
  currentUser: Account | null
  currentCompany: Company | null
  currentProject: SiteProject | null
  progress: Record<string, boolean>
  ladder: LadderResult
  login: (email: string, password: string) => { ok: boolean; message?: string }
  register: (data: {
    name: string
    email: string
    password: string
    companyName: string
  }) => { ok: boolean; message?: string }
  logout: () => void
  loginDemo: () => void
  updateCompany: (patch: Partial<Company>) => void
  updateProject: (patch: Partial<SiteProject>) => void
  toggleLesson: (lessonId: string, done?: boolean) => void
  resetDemo: () => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

const LEVELS = [
  { min: 0, label: "Ötlet fázis" },
  { min: 20, label: "Elindult vállalkozó" },
  { min: 45, label: "Fejlődő vállalkozás" },
  { min: 70, label: "Felkészült vállalkozás" },
  { min: 90, label: "Digitálisan érett vállalkozás" },
]

function computeLadder(company: Company | null, project: SiteProject | null, progress: Record<string, boolean>): LadderResult {
  // Profile completeness
  const profileFields = company
    ? [company.name, company.taxNumber, company.headquarters, company.phone, company.email, company.activity, company.description, company.contactName]
    : []
  const profileFilled = profileFields.filter((v) => v && String(v).trim().length > 0).length
  const profile = company ? Math.round((profileFilled / 8) * 100) : 0

  // Website completeness (steps + published)
  let website = 0
  if (project) {
    const step = Math.min(project.currentStep, 4)
    website = Math.round((step / 4) * 70)
    if (project.status === "published") website = 100
    else website = Math.min(website + (project.services.length ? 15 : 0) + (project.heroTitle ? 15 : 0), 90)
  }

  // Education: completed lessons across active courses
  const activeLessons = ALL_COURSES.filter((c) => c.status === "active").flatMap((c) => c.lessons)
  const doneLessons = activeLessons.filter((l) => progress[l.id]).length
  const education = activeLessons.length ? Math.round((doneLessons / activeLessons.length) * 100) : 0

  // Online presence: logo, gallery, services, contact
  let presenceScore = 0
  if (project) {
    if (project.logoUrl || company?.logoUrl) presenceScore += 25
    if (project.heroImageUrl) presenceScore += 20
    if (project.galleryUrls.length >= 2) presenceScore += 20
    if (project.services.length >= 2) presenceScore += 20
    if (project.contact.phone && project.contact.email) presenceScore += 15
  }
  const presence = Math.min(presenceScore, 100)

  const score = Math.round(profile * 0.25 + website * 0.3 + education * 0.25 + presence * 0.2)

  let levelIndex = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (score >= LEVELS[i].min) levelIndex = i
  }
  const nextLabel = levelIndex < LEVELS.length - 1 ? LEVELS[levelIndex + 1].label : null

  return {
    score,
    level: levelIndex + 1,
    levelLabel: LEVELS[levelIndex].label,
    nextLabel,
    metrics: [
      { key: "profile", label: "Vállalkozási profil", value: profile },
      { key: "website", label: "Weboldal elkészültsége", value: website },
      { key: "education", label: "Elvégzett képzések", value: education },
      { key: "presence", label: "Online megjelenés", value: presence },
    ],
  }
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PortalState>(() => buildInitialState())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PortalState
        setState(parsed)
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be full or blocked */
    }
  }, [state, ready])

  const currentUser = useMemo(
    () => state.accounts.find((a) => a.id === state.currentUserId) ?? null,
    [state.accounts, state.currentUserId],
  )
  const currentCompany = useMemo(
    () => (currentUser?.companyId ? state.companies.find((c) => c.id === currentUser.companyId) ?? null : null),
    [currentUser, state.companies],
  )
  const currentProject = useMemo(
    () => (currentUser ? state.projects.find((p) => p.ownerId === currentUser.id) ?? null : null),
    [currentUser, state.projects],
  )
  const progress = useMemo(
    () => (currentUser ? state.progress[currentUser.id] ?? {} : {}),
    [currentUser, state.progress],
  )

  const ladder = useMemo(
    () => computeLadder(currentCompany, currentProject, progress),
    [currentCompany, currentProject, progress],
  )

  const login = useCallback(
    (email: string, password: string) => {
      const acc = state.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
      if (!acc) return { ok: false, message: "Nincs ilyen e-mail címmel regisztrált fiók." }
      if (acc.password !== password) return { ok: false, message: "Hibás jelszó." }
      setState((s) => ({ ...s, currentUserId: acc.id }))
      return { ok: true }
    },
    [state.accounts],
  )

  const loginDemo = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: "user-demo" }))
  }, [])

  const register = useCallback(
    (data: { name: string; email: string; password: string; companyName: string }) => {
      const exists = state.accounts.some((a) => a.email.toLowerCase() === data.email.trim().toLowerCase())
      if (exists) return { ok: false, message: "Ezzel az e-mail címmel már létezik fiók." }
      const uid = `user-${Date.now()}`
      const cid = `company-${Date.now()}`
      const now = new Date().toISOString()
      const account: Account = {
        id: uid,
        role: "user",
        name: data.name,
        email: data.email.trim(),
        password: data.password,
        verified: true,
        companyId: cid,
        createdAt: now,
      }
      const company: Company = {
        id: cid,
        ownerId: uid,
        name: data.companyName,
        taxNumber: "",
        registrationNumber: "",
        headquarters: "",
        phone: "",
        email: data.email.trim(),
        website: "",
        activity: "",
        description: "",
        contactName: data.name,
        logoUrl: null,
        createdAt: now,
      }
      const project: SiteProject = {
        id: `site-${Date.now()}`,
        ownerId: uid,
        companyId: cid,
        status: "draft",
        currentStep: 1,
        name: `${data.companyName} weboldala`,
        slug: data.companyName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 40) || "uj-weboldal",
        template: "modern",
        primaryColor: "#3743d8",
        accentColor: "#027671",
        fontScale: 1,
        radius: 14,
        layout: "split",
        companyName: data.companyName,
        activity: "",
        shortDescription: "",
        heroTitle: `Üdvözöljük a(z) ${data.companyName} oldalán`,
        heroSubtitle: "",
        heroImageUrl: null,
        logoUrl: null,
        galleryUrls: [],
        aboutTitle: "Rólunk",
        aboutText: "",
        ctaText: "Kapcsolatfelvétel",
        pages: { home: true, about: true, services: true, references: false, pricing: false, contact: true, blog: false },
        services: [],
        references: [],
        contact: { phone: "", email: data.email.trim(), address: "", hours: "", showForm: true },
        updatedAt: now,
        publishedAt: null,
      }
      setState((s) => ({
        ...s,
        accounts: [...s.accounts, account],
        companies: [...s.companies, company],
        projects: [...s.projects, project],
        progress: { ...s.progress, [uid]: {} },
        currentUserId: uid,
      }))
      return { ok: true }
    },
    [state.accounts],
  )

  const logout = useCallback(() => setState((s) => ({ ...s, currentUserId: null })), [])

  const updateCompany = useCallback(
    (patch: Partial<Company>) => {
      setState((s) => {
        if (!s.currentUserId) return s
        const user = s.accounts.find((a) => a.id === s.currentUserId)
        if (!user?.companyId) return s
        return {
          ...s,
          companies: s.companies.map((c) => (c.id === user.companyId ? { ...c, ...patch } : c)),
        }
      })
    },
    [],
  )

  const updateProject = useCallback((patch: Partial<SiteProject>) => {
    setState((s) => {
      if (!s.currentUserId) return s
      return {
        ...s,
        projects: s.projects.map((p) =>
          p.ownerId === s.currentUserId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
        ),
      }
    })
  }, [])

  const toggleLesson = useCallback((lessonId: string, done?: boolean) => {
    setState((s) => {
      if (!s.currentUserId) return s
      const uid = s.currentUserId
      const cur = s.progress[uid] ?? {}
      const next = done === undefined ? !cur[lessonId] : done
      return { ...s, progress: { ...s.progress, [uid]: { ...cur, [lessonId]: next } } }
    })
  }, [])

  const resetDemo = useCallback(() => {
    const fresh = buildInitialState()
    setState(fresh)
  }, [])

  const value: PortalContextValue = {
    ready,
    state,
    currentUser,
    currentCompany,
    currentProject,
    progress,
    ladder,
    login,
    register,
    logout,
    loginDemo,
    updateCompany,
    updateProject,
    toggleLesson,
    resetDemo,
  }

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error("usePortal must be used within PortalProvider")
  return ctx
}
