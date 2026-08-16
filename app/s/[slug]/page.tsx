"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { SitePreview } from "@/components/site-preview"
import { STORAGE_KEY } from "@/lib/seed"
import type { PortalState, SiteProject } from "@/lib/types"

export default function LiveSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [project, setProject] = useState<SiteProject | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PortalState
        const found = parsed.projects.find((p) => p.slug === slug) ?? null
        setProject(found)
      }
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [slug])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-neutral-400">Betöltés…</div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-neutral-800">Az oldal nem található</h1>
        <p className="max-w-sm text-neutral-500">
          Ez a weboldal még nem érhető el ezen a címen. Lehet, hogy a böngészőjében nincs mentett vázlat ehhez a
          címhez.
        </p>
        <Link href="/app/website" className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-semibold text-white">
          Vissza a szerkesztőbe
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <SitePreview project={project} animated />
    </main>
  )
}
