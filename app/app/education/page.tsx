"use client"

import Link from "next/link"
import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"
import { COURSES, AI_COURSES } from "@/lib/seed"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types"

function CourseCard({ course, progress }: { course: Course; progress: Record<string, boolean> }) {
  const done = course.lessons.filter((l) => progress[l.id]).length
  const total = course.lessons.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const active = course.status === "active"

  const inner = (
    <div
      className={cn(
        "glass-panel group flex h-full flex-col rounded-2xl p-6 transition-transform",
        active ? "hover:-translate-y-1" : "opacity-80",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: `${course.color}1a`, color: course.color }}
        >
          <Icon.education width={22} height={22} />
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
          )}
        >
          {active ? "Elérhető" : "Hamarosan"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded bg-muted px-2 py-0.5 font-medium">{course.level}</span>
        <span>{course.duration}</span>
        <span>· {course.lessonCount} lecke</span>
      </div>
      <h3 className="mt-2 font-display text-lg font-bold text-foreground">{course.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{course.description}</p>

      {active ? (
        <>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{done}/{total} lecke</span>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: course.color }} />
            </div>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            {done > 0 ? "Folytatás" : "Kezdés"}
            <Icon.arrowRight width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </>
      ) : (
        <span className="mt-4 text-sm text-muted-foreground">Ez a kurzus fejlesztés alatt áll.</span>
      )}
    </div>
  )

  return active ? (
    <Link href={`/app/education/${course.id}`} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full cursor-default">{inner}</div>
  )
}

export default function EducationPage() {
  const { progress } = usePortal()

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Edukáció</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ingyenes videós kurzusok a vállalkozás indításától a mesterséges intelligenciáig. Minden elvégzett lecke
          növeli a vállalkozói indexét.
        </p>
      </div>

      {/* AI highlight */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Icon.sparkle className="text-violet" width={18} height={18} />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet">Új: Mesterséges intelligencia</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {AI_COURSES.map((c) => (
            <CourseCard key={c.id} course={c} progress={progress} />
          ))}
          <div className="glass-panel flex flex-col justify-center rounded-2xl p-6">
            <h3 className="font-display text-base font-bold text-foreground">Miért érdemes MI-t tanulni?</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {["Gyorsabb ügyfélkommunikáció és szövegírás", "Ajánlatok és hirdetések percek alatt", "Egyszerű arculati elemek és képek"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Icon.check width={16} height={16} className="mt-0.5 shrink-0 text-violet" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Startup courses */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Vállalkozásindítás</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <CourseCard key={c.id} course={c} progress={progress} />
          ))}
        </div>
      </section>
    </div>
  )
}
