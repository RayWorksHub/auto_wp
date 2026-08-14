import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const values = [
  {
    title: "Egyértelmű",
    body: "Minden folyamat közérthető nyelven, felesleges szakzsargon nélkül. Egy lépés egy döntés.",
  },
  {
    title: "Átlátható",
    body: "Mindig látod, hol tartasz, mi a következő teendő, és miért fontos. Nincsenek rejtett lépések.",
  },
  {
    title: "Támogató",
    body: "A kezdő vállalkozót végigkísérjük a regisztrációtól az első online megjelenésig.",
  },
  {
    title: "Ingyenes",
    body: "A portál minden alapszolgáltatása díjmentesen elérhető a magyar mikrovállalkozásoknak.",
  },
]

const steps = [
  { n: "01", t: "Regisztráció", d: "Néhány perc alatt létrehozod a vállalkozói fiókodat." },
  { n: "02", t: "Profil kitöltése", d: "Megadod a vállalkozásod alapadatait és arculatát." },
  { n: "03", t: "Tanulás", d: "Elvégzed a személyre szabott edukációs modulokat." },
  { n: "04", t: "Online megjelenés", d: "Elkészíted az első weboldaladat a varázslóval." },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
          <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
            <p className="text-sm font-medium text-primary">A Portálról</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              A kezdő vállalkozók digitális belépőpontja
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              A Vállalkozói Portál egy állami kezdeményezés, amely egyetlen felületen segíti a mikro- és kisvállalkozásokat
              az elinduláshoz szükséges tudás megszerzésében és az első online megjelenésük létrehozásában.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="font-serif text-2xl font-semibold">Alapelveink</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="glass-panel rounded-2xl p-6">
                <h3 className="font-serif text-lg font-semibold text-primary">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="font-serif text-2xl font-semibold">Hogyan működik?</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="rounded-2xl border border-border bg-background p-6">
                  <span className="font-serif text-2xl font-bold text-primary/30">{s.n}</span>
                  <h3 className="mt-2 font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
