"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"
import { cn, initials } from "@/lib/utils"

const NAV = [
  { href: "/app", label: "Áttekintés", icon: Icon.dashboard },
  { href: "/app/education", label: "Edukáció", icon: Icon.education },
  { href: "/app/website", label: "Online megjelenés", icon: Icon.globe },
  { href: "/app/profile", label: "Vállalkozási profil", icon: Icon.profile },
]

const SECONDARY = [
  { href: "/help", label: "Súgó", icon: Icon.help },
  { href: "/about", label: "A programról", icon: Icon.shield },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, currentUser, currentCompany, logout, ladder } = usePortal()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (ready && !currentUser) router.replace("/belepes")
  }, [ready, currentUser, router])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!ready || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const isActive = (href: string) => (href === "/app" ? pathname === "/app" : pathname.startsWith(href))

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon.shield width={20} height={20} />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-foreground">Vállalkozói Portál</p>
          <p className="text-[11px] text-muted-foreground">Tanulj, építs, növekedj</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Fő navigáció">
        {NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon width={18} height={18} />
              {item.label}
            </Link>
          )
        })}

        <div className="my-3 h-px bg-border" />

        {SECONDARY.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <item.icon width={18} height={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 rounded-lg bg-muted/60 px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Ranglétra pontszám</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-primary" style={{ width: `${ladder.score}%` }} />
            </div>
            <span className="text-sm font-bold text-foreground">{ladder.score}</span>
          </div>
        </div>
        <button
          onClick={() => {
            logout()
            router.push("/")
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Icon.logout width={18} height={18} />
          Kijelentkezés
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card/70 backdrop-blur-xl lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-card">{SidebarContent}</div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button
            className="rounded-lg border border-border p-2 text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menü megnyitása"
          >
            <Icon.menu />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">
              Üdvözöljük, <span className="font-medium text-foreground">{currentUser.name}</span>
            </p>
          </div>
          <Link
            href="/app/profile"
            className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3 transition-colors hover:bg-muted"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials(currentCompany?.name ?? currentUser.name)}
            </span>
            <span className="hidden max-w-[160px] truncate text-sm font-medium text-foreground sm:block">
              {currentCompany?.name ?? currentUser.name}
            </span>
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
