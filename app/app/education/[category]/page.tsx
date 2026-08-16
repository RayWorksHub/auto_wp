"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { usePortal } from "@/components/portal-provider"
import { ALL_COURSES } from "@/lib/seed"
import { Reveal } from "@/components/reveal"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types"

type CategoryId = "startup" | "ai" | "office"

const META: Record<CategoryId, { label: string; desc: string; icon: React.ReactNode }> = {
  startup: {
    label: "Vállalkozás",
    desc: "A vállalkozás elindításának és működtetésének alapjai.",
    icon: <Icon.rocket width={22} height={22} />,
  },
  ai: {
    label: "Mesterséges intelligencia",
    desc: "MI eszközök a mindennapi vállalkozói munkában.",
    icon: <Icon.sparkle width={22} height={22} />,
  },
  office: {
    label: "Irodai készségek",
    desc: "Excel, Word és prezentáció a gyakorlatban.",
    icon: <Icon.office width={22} height={22} />,
  },
}

function courseProgress(course: Course, progress: Record<string, boolean>) {
  const total = course.lessons.length
  if (total === 0) return 0
  const done = course.lessons.filter((l) => progress[l.id]).length
  return Math.round((done / total) * 100)
}

export default function EducationCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const { progress }: { progress: Record<string, boolean> } = usePortal()

  if (!(category in META)) return notFound()
  const cat = category as CategoryId
  const meta = META[cat]
  const courses = ALL_COURSES.filter((c) => c.type === cat)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Reveal>
        <Link
          href="/app/education"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <span className="rotate-180">
            <Icon.arrowRight width={16} height={16} />
          </span>
          Vissza a témákhoz
        </Link>
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {meta.icon}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{meta.label}</h1>
            <p className="mt-1 text-pretty text-muted-foreground">{meta.desc}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  {meta.icon}
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
              {isComing ? card : <Link href={`/app/education/${cat}/${course.id}`}>{card}</Link>}
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
