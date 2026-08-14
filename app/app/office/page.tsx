"use client"

import Link from "next/link"
import { OFFICE_TRACKS } from "@/lib/seed"
import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"

export default function OfficePage() {
  const { progress } = usePortal()

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Online megjelenés · Digitális eszközök</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Irodai készségek
        </h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
          Gyakorlati, lépésről lépésre felépített képzések a legfontosabb irodai programokhoz. A tudás, amivel a
          számlázástól az árajánlatig mindent magabiztosan kezelsz.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {OFFICE_TRACKS.map((track) => {
          const done = track.lessons.filter((l) => progress[l.id]).length
          const total = track.lessons.length
          const pct = total ? Math.round((done / total) * 100) : 0
          return (
            <Link
              key={track.id}
              href={`/app/office/${track.id}`}
              className="glass-panel group flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ background: `${track.color}1a`, color: track.color }}
                >
                  {track.product?.split(" ").pop()?.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-muted-foreground">{total} lecke</span>
              </div>
              <h2 className="font-serif text-lg font-semibold">{track.title}</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{track.summary}</p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Haladás</span>
                  <span className="font-semibold" style={{ color: track.color }}>{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: track.color }} />
                </div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {pct > 0 ? "Folytatom" : "Kezdés"}
                <Icon.arrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
