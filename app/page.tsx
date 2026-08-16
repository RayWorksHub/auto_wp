import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Reveal } from "@/components/reveal"
import { Icon } from "@/components/icons"

const SERVICES = [
  {
    icon: Icon.education,
    title: "Edukáció",
    text: "Videós kurzusok a vállalkozásindításról, pénzügyekről, marketingről, irodai programokról és a mesterséges intelligenciáról – egy helyen.",
    tint: "bg-primary/10 text-primary",
  },
  {
    icon: Icon.globe,
    title: "Online megjelenés",
    text: "Néhány perc alatt professzionális, animált weboldal a vállalkozásának: testreszabható sablon, saját képek, élő előnézet.",
    tint: "bg-teal/10 text-teal",
  },
  {
    icon: Icon.profile,
    title: "Vállalkozási profil",
    text: "Egy helyen kezelheti cége adatait, logóját és bemutatkozását, amelyekből a weboldala és megjelenése is épül.",
    tint: "bg-violet/10 text-violet",
  },
  {
    icon: Icon.ladder,
    title: "Vállalkozói index",
    text: "Egyetlen mutató, amely megmutatja, hol tart a fejlődési úton, és mi a következő javasolt lépés.",
    tint: "bg-gold/10 text-gold",
  },
]

const STEPS = [
  { n: "1", title: "Regisztráljon", text: "Hozzon létre fiókot a vállalkozása adataival néhány perc alatt." },
  { n: "2", title: "Tanuljon és építkezzen", text: "Végezze el a kurzusokat, töltse ki a profilját, készítse el a weboldalát." },
  { n: "3", title: "Kövesse a fejlődését", text: "A vállalkozói index folyamatosan mutatja, hol tart és mit érdemes legközelebb megtennie." },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO with login island */}
      <section className="relative isolate overflow-hidden">
        {/* Background layer (z-0, sits inside the section, not behind the page) */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-bg.png" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark opacity-95" />
          <div className="absolute inset-0 grid-bg opacity-[0.12]" />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal/30 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-violet/25 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-6 lg:py-24">
          <div className="animate-rise text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Icon.sparkle width={14} height={14} />
              Minden a vállalkozásindításhoz, egy helyen
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Indítsa el és fejlessze vállalkozását digitálisan
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
              Képzések, saját weboldal, irodai és MI-készségek, valamint egy áttekinthető fejlődési index – egyszerűen,
              érthetően, ingyenesen.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
              {[
                ["16+", "videós lecke"],
                ["4", "fő szolgáltatás"],
                ["100%", "ingyenes"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold sm:text-3xl">{v}</dt>
                  <dd className="text-xs text-primary-foreground/80">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Login / registration island */}
          <div className="animate-rise rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="font-display text-xl font-bold text-foreground">Belépés a portálra</h2>
            <p className="mt-1 text-sm text-muted-foreground">Válassza ki, hogyan szeretne továbblépni.</p>

            <div className="mt-6 space-y-3">
              <Link
                href="/belepes"
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 transition-all hover:border-primary hover:shadow-md"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon.lock width={22} height={22} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">Bejelentkezés</span>
                    <span className="block text-xs text-muted-foreground">Már van fiókom</span>
                  </span>
                </span>
                <Icon.arrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>

              <Link
                href="/regisztracio"
                className="group flex items-center justify-between rounded-xl bg-primary px-4 py-4 text-primary-foreground transition-all hover:bg-primary-dark hover:shadow-md"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/15">
                    <Icon.profile width={22} height={22} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">Regisztráció</span>
                    <span className="block text-xs text-primary-foreground/80">Új vállalkozói fiók létrehozása</span>
                  </span>
                </span>
                <Icon.arrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-6 rounded-xl bg-muted/70 p-4">
              <p className="text-xs font-medium text-foreground">Csak kipróbálná?</p>
              <p className="mt-1 text-xs text-muted-foreground">
                A bejelentkezés oldalon egy kattintással beléphet a demó fiókba, előre kitöltött adatokkal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="szolgaltatasok" className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Szolgáltatások</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
            Minden eszköz egy helyen a vállalkozásához
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">
            Négy egymásra épülő szolgáltatás. Bármelyikkel kezdheti – a rendszer végigvezeti a lépéseken.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <article className="glass-panel group h-full rounded-2xl p-6 transition-transform hover:-translate-y-1">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tint}`}>
                  <s.icon width={24} height={24} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="hogyan" className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">Hogyan működik</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Három egyszerű lépés</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 110}>
                <div className="relative h-full rounded-2xl border border-border bg-background p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground lg:px-12 lg:py-16">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal/30 blur-3xl" />
            <div className="relative">
              <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">
                Kezdje el még ma – teljesen ingyenesen
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-primary-foreground/90">
                Csatlakozzon a programhoz, és tegye meg az első lépéseket a digitális vállalkozás felé.
              </p>
              <Link
                href="/regisztracio"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]"
              >
                Regisztráció indítása
                <Icon.arrowRight width={18} height={18} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
