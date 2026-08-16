"use client"

import { useState } from "react"
import { usePortal } from "@/components/portal-provider"
import { Reveal } from "@/components/reveal"
import { Icon } from "@/components/icons"
import { VideoCall } from "@/components/video-call"
import { cn } from "@/lib/utils"

const TOPICS = [
  { id: "website", label: "Weboldal beállítása", desc: "Segítség a weboldalvarázsló használatában.", icon: Icon.globe },
  { id: "profile", label: "Vállalkozási profil", desc: "Cégadatok, logó és elérhetőségek kitöltése.", icon: Icon.profile },
  { id: "education", label: "Tananyag és videók", desc: "Kurzusok, leckék és a lejátszó használata.", icon: Icon.education },
  { id: "social", label: "Közösségi média", desc: "Facebook oldal, Instagram és hirdetések.", icon: Icon.share },
  { id: "account", label: "Fiók és belépés", desc: "Jelszó, adatok és beállítások kezelése.", icon: Icon.lock },
  { id: "other", label: "Egyéb kérdés", desc: "Bármilyen más, amiben elakadt.", icon: Icon.help },
]

const STEPS = [
  { t: "Válasszon témát", d: "Jelölje meg, miben szeretne segítséget, hogy a megfelelő operátorhoz kerüljön." },
  { t: "Indítsa a hívást", d: "Egy kattintással kapcsolódik egy szabad munkatárshoz élő videóhívásban." },
  { t: "Oldjuk meg együtt", d: "Az operátor végigvezeti a beállításon, akár képernyőmegosztással." },
]

export default function SupportPage() {
  const { currentUser } = usePortal()
  const [selected, setSelected] = useState<string>("website")
  const [inCall, setInCall] = useState(false)

  const topic = TOPICS.find((t) => t.id === selected) ?? TOPICS[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Reveal>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Icon.headset width={14} height={14} />
            Távoli segítségnyújtás
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
            Élő segítség egy operátortól
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Elakadt egy beállításnál? Indítson videóhívást, és egy munkatársunk élőben végigvezeti a lépéseken –
            pontosan úgy, mintha ott ülne Ön mellett.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: topic selection */}
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-foreground">Miben segíthetünk?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Válassza ki a témát a hívás indítása előtt.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {TOPICS.map((t) => {
                const active = t.id === selected
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelected(t.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <t.icon width={20} height={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-foreground">{t.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{t.desc}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Right: call launcher */}
        <Reveal delay={80}>
          <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/support/operator.png" alt="Ügyfélszolgálati operátor" className="h-44 w-full object-cover" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                Operátorok elérhetők
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm text-muted-foreground">Kiválasztott téma</p>
              <p className="font-display text-lg font-bold text-foreground">{topic.label}</p>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon.clock width={16} height={16} />
                  <span>Átlagos várakozás: kevesebb mint 1 perc</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon.users width={16} height={16} />
                  <span>Magyar nyelvű, dedikált munkatárs</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon.shield width={16} height={16} />
                  <span>Biztonságos, titkosított kapcsolat</span>
                </div>
              </dl>

              <button
                onClick={() => setInCall(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
              >
                <Icon.video width={18} height={18} />
                Videóhívás indítása
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Bemutató hívás – valós kamera és mikrofon nem szükséges.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* How it works */}
      <Reveal delay={120}>
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Hogyan működik?</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-base font-bold text-foreground">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {inCall && (
        <VideoCall topic={topic.label} userName={currentUser?.name ?? "Ön"} onClose={() => setInCall(false)} />
      )}
    </div>
  )
}
