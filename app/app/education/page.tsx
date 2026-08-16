"use client"

import Link from "next/link"
import { usePortal } from "@/components/portal-provider"
import { ALL_COURSES } from "@/lib/seed"
import { Reveal } from "@/components/reveal"
import { Icon } from "@/components/icons"

type CategoryId = "startup" | "ai" | "office"

const CATEGORIES: {
  id: CategoryId
  label: string
  desc: string
  color: string
  icon: (p: { width: number; height: number }) => React.ReactNode
}[] = [
  {
    id: "startup",
    label: "Vállalkozás",
    desc: "A vállalkozás elindításának és működtetésének alapjai – lépésről lépésre.",
    color: "#4f46e5",
    icon: (p) => <Icon.rocket {...p} />,
  },
  {
    id: "ai",
    label: "Mesterséges intelligencia",
    desc: "Használja ki az MI eszközöket a mindennapi vállalkozói munkában.",
    color: "#0ea5e9",
    icon: (p) => <Icon.sparkle {...p} />,
  },
  {
    id: "office",
    label: "Irodai készségek",
    desc: "Excel, Word és prezentáció – gyakorlati digitális készségek.",
    color: "#0d9488",
    icon: (p) => <Icon.office {...p} />,
  },
]

function lessonsIn(category: CategoryId) {
  return ALL_COURSES.filter((c) => c.type === category)
}

export default function EducationPage() {
  const { progress }: { progress: Record<string, boolean> } = usePortal()

  const totalLessons = ALL_COURSES.reduce((s, c) => s + c.lessons.length, 0)
  const doneLessons = ALL_COURSES.reduce(
    (s, c) => s + c.lessons.filter((l) => progress[l.id]).length,
    0,
  )

  const statsFor = (category: CategoryId) => {
    const courses = lessonsIn(category)
    const lessons = courses.reduce((s, c) => s + c.lessons.length, 0)
    const done = courses.reduce((s, c) => s + c.lessons.filter((l) => progress[l.id]).length, 0)
    const pct = lessons ? Math.round((done / lessons) * 100) : 0
    return { courses: courses.length, lessons, done, pct }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Edukáció</h1>
            <p className="mt-1 max-w-xl text-pretty text-muted-foreground">
              Válasszon egy témát, és kezdje el a hozzá tartozó képzéseket – a vállalkozás elindításától az MI
              használatáig.
            </p>
          </div>
          <div className="glass-panel flex items-center gap-4 rounded-2xl px-5 py-3">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{doneLessons}</p>
              <p className="text-[11px] text-muted-foreground">teljesített</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{totalLessons}</p>
              <p className="text-[11px] text-muted-foreground">összes lecke</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Category cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {CATEGORIES.map((cat, i) => {
          const stats = statsFor(cat.id)
          return (
            <Reveal key={cat.id} delay={i * 80}>
              <Link
                href={`/app/education/${cat.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div
                  className="flex items-center gap-4 p-6"
                  style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)` }}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
                    {cat.icon({ width: 28, height: 28 })}
                  </span>
                  <div className="text-white">
                    <h2 className="font-display text-xl font-bold">{cat.label}</h2>
                    <p className="text-xs text-white/85">{stats.courses} kurzus · {stats.lessons} lecke</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-pretty text-sm text-muted-foreground">{cat.desc}</p>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Haladás</span>
                      <span className="font-semibold text-foreground">{stats.pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${stats.pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Kurzusok megtekintése
                    <span className="transition-transform group-hover:translate-x-1">
                      <Icon.arrowRight width={16} height={16} />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
