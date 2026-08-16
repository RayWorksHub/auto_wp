import type React from "react"
import Link from "next/link"
import { Icon } from "@/components/icons"

interface AuthFrameProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
  wide?: boolean
}

export function AuthFrame({ title, subtitle, children, footer, wide = false }: AuthFrameProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-primary-dark">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-bg.png" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary/90 to-primary-dark/95" />
        <div className="absolute inset-0 grid-bg opacity-10" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-primary-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15 backdrop-blur">
            <Icon.shield width={20} height={20} />
          </span>
          <span className="font-display text-sm font-bold">Vállalkozói Portál</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary-foreground/25 px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Icon.home width={16} height={16} />
          Főoldal
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className={`w-full ${wide ? "max-w-lg" : "max-w-md"} animate-rise`}>
          <div className="glass-strong rounded-2xl border border-primary-foreground/20 p-7 shadow-2xl sm:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
          {footer ? <div className="mt-5 text-center">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
