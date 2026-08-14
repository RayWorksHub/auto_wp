"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePortal } from "@/components/portal-provider"
import { ALL_COURSES } from "@/lib/seed"
import { Reveal } from "@/components/reveal"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types"

type Topic = "all" | "startup" | "ai" | "office"

const TOPICS: { id: Topic; label: string }[] = [
  { id: "all", label: "Összes" },
  { id: "startup", label: "Vállalkozás" },
  { id: "ai", label: "Mesterséges intelligencia" },
  { id: "office", label: "Irodai készségek" },
]

function courseProgress(course: Course, progress: Record<string, boolean>) {
  const total = course.lessons.length
  if (total === 0) return 0
  const done = course.lessons.filter((l) => progress[l.id]).length
  return Math.round((done / total) * 100)
}

function courseIcon(type: Course["type"]) {
  if (type === "ai") return <Icon.sparkle width={20} height={20} />
  if (type === "office") return <Icon.office width={20} height={20} />
  return <Icon.rocket width={20} height={20} />
}

export default function EducationPage() {
  const { progress } = usePortal()
  const [topic, setTopic] = useState<Topic>("all")

  const courses = useMemo(() => {
    if (topic === "all") return ALL_COURSES
    return ALL_COURSES.filter((c) => c.type === topic)
  }, [topic])

  const featured = ALL_COURSES.find((c) => c.type === "ai")!
  const featuredPct = courseProgress(featured, progress)

  const totalLessons = ALL_COURSES.reduce((s, c) => s + c.lessons.length, 0)
  const doneLessons = ALL_COURSES.reduce(
    (s, c) => s + c.lessons.filter((l) => progress[l.id]).length,
    0,
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Edukáció</h1>
            <p className="mt-1 max-w-xl text-pretty text-muted-foreground">
              Minden képzés egy helyen – a vállalkozás elindításától az MI használatáig és az irodai eszközökig.
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

      {/* Featured AI course */}
      <Reveal delay={80}>
        <Link
          href={`/app/education/${featured.id}`}
          className="group mt-8 block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary via-primary to-primary-dark text-primary-foreground shadow-xl transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="grid gap-6 p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Icon.sparkle width={13} height={13} /> Új képzés
              </span>
              <h2 className="mt-3 text-balance font-display text-2xl font-bold md:text-3xl">{featured.title}</h2>
              <p className="mt-2 max-w-lg text-pretty text-sm text-primary-foreground/85">{featured.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary transition-transform group-hover:scale-[1.03]">
                  {featuredPct > 0 ? "Folytatás" : "Kezdés"}
                  <Icon.arrowRight width={16} height={16} />
                </span>
                <span className="text-xs text-primary-foreground/80">
                  {featured.lessons.length} lecke · {featured.duration}
                </span>
              </div>
            </div>
            <div className="hidden gap-2 md:grid">
              {featured.lessons.slice(0, 4).map((l, i) => (
                <div key={l.id} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="truncate text-sm">{l.title}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </Reveal>

      {/* Topic chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopic(t.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              topic === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => {
          const pct = courseProgress(course, progress)
          const isComing = course.status === "coming-soon"
          const card = (
            <div
              className={cn(
                "flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300",
                !isComing && "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
                isComing && "opacity-70",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: course.color }}
                >
                  {courseIcon(course.type)}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {course.product ?? course.level}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug text-foreground">{course.title}</h3>
              <p className="mt-1.5 flex-1 text-pretty text-sm text-muted-foreground">{course.description}</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {course.lessons.length} lecke · {course.duration}
                  </span>
                  {!isComing && <span className="font-semibold text-foreground">{pct}%</span>}
                </div>
                {!isComing ? (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: course.color }}
                    />
                  </div>
                ) : (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Hamarosan
                  </div>
                )}
              </div>
            </div>
          )
          return (
            <Reveal key={course.id} delay={i * 60}>
              {isComing ? card : <Link href={`/app/education/${course.id}`}>{card}</Link>}
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
