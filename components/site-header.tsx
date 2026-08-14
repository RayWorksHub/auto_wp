"use client"

import Link from "next/link"
import { Icon } from "@/components/icons"
import { usePortal } from "@/components/portal-provider"

export function SiteHeader() {
  const { currentUser } = usePortal()

  return (
    <>
      {/* Government identity strip */}
      <div className="bg-primary-dark text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[12px] lg:px-6">
          <span className="flex items-center gap-2 opacity-90">
            <Icon.shield width={14} height={14} />
            Hivatalos vállalkozásfejlesztési portál
          </span>
          <div className="hidden items-center gap-4 opacity-90 sm:flex">
            <Link href="/help" className="hover:underline">
              Súgó
            </Link>
            <Link href="/about" className="hover:underline">
              A programról
            </Link>
            <span aria-hidden>HU</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon.shield width={20} height={20} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold text-foreground">Vállalkozói Portál</span>
              <span className="block text-[11px] text-muted-foreground">Nemzeti Digitális Program</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Fő menü">
            <Link href="/#szolgaltatasok" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Szolgáltatások
            </Link>
            <Link href="/#hogyan" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              Hogyan működik
            </Link>
            <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              A programról
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
              >
                Belépés a fiókba
                <Icon.arrowRight width={16} height={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/belepes"
                  className="hidden rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted sm:inline-flex"
                >
                  Bejelentkezés
                </Link>
                <Link
                  href="/regisztracio"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
                >
                  Regisztráció
                  <Icon.arrowRight width={16} height={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
