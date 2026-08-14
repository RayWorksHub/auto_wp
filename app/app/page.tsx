"use client"

import Link from "next/link"
import { usePortal } from "@/components/portal-provider"
import { LadderIndex } from "@/components/ladder-index"
import { Icon } from "@/components/icons"
import { ALL_COURSES } from "@/lib/seed"

export default function DashboardPage() {
  const { currentCompany, currentProject, progress, ladder } = usePortal()

  const activeCourses = ALL_COURSES.filter((c) => c.status === "active")
  const totalLessons = activeCourses.reduce((n, c) => n + c.lessons.length, 0)
  const doneLessons = activeCourses.reduce((n, c) => n + c.lessons.filter((l) => progress[l.id]).length, 0)

  const websiteState =
    currentProject?.status === "published"
      ? "Publikálva"
      : currentProject && currentProject.currentStep > 1
        ? `Vázlat – ${currentProject.currentStep}. lépés`
        : "Még nincs elkezdve"

  const services = [
    {
      href: "/app/education",
      icon: Icon.education,
      title: "Edukáció",
      desc: "Videós kurzusok a vállalkozásról, marketingről, irodai eszközökről és az MI-ről.",
      stat: `${doneLessons}/${totalLessons} lecke kész`,
      progress: totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0,
      tint: "bg-primary/10 text-primary",
      bar: "bg-primary",
    },
    {
      href: "/app/website",
      icon: Icon.globe,
      title: "Online megjelenés",
      desc: "Készítse el vállalkozása testreszabható weboldalát és publikálja néhány perc alatt.",
      stat: websiteState,
      progress: ladder.metrics.find((m) => m.key === "website")?.value ?? 0,
      tint: "bg-teal/10 text-teal",
      bar: "bg-teal",
    },
    {
      href: "/app/profile",
      icon: Icon.profile,
      title: "Vállalkozási profil",
      desc: "Adja meg cége adatait és töltse fel logóját az egységes megjelenéshez.",
      stat: `${ladder.metrics.find((m) => m.key === "profile")?.value ?? 0}% kitöltve`,
      progress: ladder.metrics.find((m) => m.key === "profile")?.value ?? 0,
      tint: "bg-gold/10 text-gold",
      bar: "bg-gold",
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Áttekintés</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {currentCompany?.name ? `${currentCompany.name} –` : ""} válasszon szolgáltatást, és lépjen tovább a
          fejlődésben.
        </p>
      </div>

      <div className="mb-6">
        <LadderIndex />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Szolgáltatások</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="glass-panel group flex flex-col rounded-2xl p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tint}`}>
                <s.icon width={22} height={22} />
              </span>
              <Icon.arrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{s.stat}</span>
                <span className="text-muted-foreground">{s.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${s.bar} transition-all duration-700`} style={{ width: `${s.progress}%` }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/app/website" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon.sparkle width={20} height={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Következő javasolt lépés</p>
            <p className="text-sm text-muted-foreground">
              {ladder.nextLabel ? `Haladjon a(z) „${ladder.nextLabel}" szint felé.` : "Minden fő lépést teljesített."}
            </p>
          </div>
        </Link>
        <Link href="/help" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
            <Icon.help width={20} height={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Segítségre van szüksége?</p>
            <p className="text-sm text-muted-foreground">Nézze meg a súgót és a gyakori kérdéseket.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
