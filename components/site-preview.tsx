"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import type { SiteProject } from "@/lib/types"
import { initials } from "@/lib/utils"

function ContactIcon({ d }: { d: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="mt-0.5 shrink-0 opacity-90">
      <path d={d} />
    </svg>
  )
}

/* Centered content wrapper so nothing stretches edge-to-edge on wide screens. */
function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-6 ${className ?? ""}`}>{children}</div>
}

/* Branded gradient panel shown when the user hasn't uploaded an image yet. */
function BrandedPanel({ name, radius, label }: { name: string; radius: number; label?: string }) {
  return (
    <div
      className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden"
      style={{ borderRadius: radius, background: "linear-gradient(135deg, var(--sp-primary), var(--sp-accent))" }}
    >
      <span className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-xl" />
      <span className="pointer-events-none absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-black/10 blur-xl" />
      <div className="relative flex flex-col items-center gap-2 text-white">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur">
          {initials(name || "Cég")}
        </span>
        {label ? <span className="text-xs font-medium opacity-90">{label}</span> : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll-reveal wrapper (fade + rise). Static when animated=false.    */
/* ------------------------------------------------------------------ */
function Section({
  children,
  animated,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode
  animated: boolean
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(!animated)

  useEffect(() => {
    if (!animated) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [animated])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(28px)",
        transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function SitePreview({
  project,
  animated = false,
}: {
  project: SiteProject
  animated?: boolean
}) {
  const { primaryColor, accentColor, radius, fontScale, layout, template } = project
  const [menuOpen, setMenuOpen] = useState(false)

  const style = {
    "--sp-primary": primaryColor,
    "--sp-accent": accentColor,
    "--sp-radius": `${radius}px`,
    "--sp-primary-soft": `color-mix(in oklab, ${primaryColor} 8%, white)`,
    "--sp-primary-tint": `color-mix(in oklab, ${primaryColor} 14%, white)`,
    fontSize: `${14 * fontScale}px`,
    scrollBehavior: "smooth",
  } as CSSProperties

  const bold = template === "bold"
  const classic = template === "classic"
  const modern = template === "modern"

  const navLinks = [
    project.pages.about && { label: "Rólunk", href: "#about" },
    project.pages.services && { label: "Szolgáltatások", href: "#services" },
    project.pages.pricing && { label: "Árak", href: "#pricing" },
    project.pages.references && { label: "Referenciák", href: "#references" },
    project.pages.blog && { label: "Blog", href: "#blog" },
    project.pages.contact && { label: "Kapcsolat", href: "#contact" },
  ].filter(Boolean) as { label: string; href: string }[]

  const services = project.services
  const references =
    project.references.length > 0
      ? project.references
      : [
          `Kiváló munka, gyors és megbízható csapat. Bátran ajánlom mindenkinek!`,
          `Végre egy vállalkozás, ahol az ügyfél az első. Legközelebb is őket választom.`,
          `Profi hozzáállás, korrekt ár. Elégedett vagyok az eredménnyel.`,
        ]
  const refNames = ["Nagy Andrea", "Kovács Tamás", "Szabó Judit"]

  const navTextColor = classic ? "#4b5563" : "rgba(255,255,255,.92)"
  const headerBg = classic
    ? "rgba(255,255,255,0.92)"
    : "color-mix(in oklab, var(--sp-primary) 92%, transparent)"
  const sectionScroll = { scrollMarginTop: 64 } as CSSProperties

  return (
    <div style={style} className="@container h-full overflow-y-auto bg-white text-neutral-800">
      {/* ---------------- Nav ---------------- */}
      <header
        className="sticky top-0 z-30 backdrop-blur"
        style={{
          background: headerBg,
          borderBottom: classic ? "1px solid #e5e7eb" : "none",
          boxShadow: modern ? "0 1px 20px -12px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <Container className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2" style={{ color: classic ? "var(--sp-primary)" : "#fff" }}>
            {project.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.logoUrl || "/placeholder.svg"} alt="" className="h-7 w-auto max-w-[120px] object-contain" />
            ) : (
              <span
                className="flex h-7 w-7 items-center justify-center text-xs font-bold"
                style={{
                  background: classic ? "var(--sp-primary)" : "rgba(255,255,255,.2)",
                  color: "#fff",
                  borderRadius: "var(--sp-radius)",
                }}
              >
                {initials(project.companyName || "Cég")}
              </span>
            )}
            <span className="font-semibold leading-tight">{project.companyName || "Az Ön vállalkozása"}</span>
          </div>

          <nav className="hidden gap-5 text-xs font-medium @md:flex" style={{ color: navTextColor }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-opacity hover:opacity-70">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden px-3 py-1.5 text-xs font-semibold @md:inline-block"
              style={{
                background: classic || modern ? "var(--sp-primary)" : "#fff",
                color: classic || modern ? "#fff" : "var(--sp-primary)",
                borderRadius: "var(--sp-radius)",
              }}
            >
              {project.ctaText || "Ajánlatkérés"}
            </a>
            {/* hamburger (mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-md @md:hidden"
              style={{ color: classic ? "var(--sp-primary)" : "#fff", background: classic ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.15)" }}
              aria-label="Menü"
              aria-expanded={menuOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </Container>

        {/* mobile dropdown */}
        {menuOpen ? (
          <div className="border-t @md:hidden" style={{ borderColor: classic ? "#e5e7eb" : "rgba(255,255,255,.2)" }}>
            <Container className="flex flex-col gap-1 py-3">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-medium"
                  style={{ color: classic ? "#374151" : "#fff" }}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-1 px-3 py-2 text-center text-sm font-semibold"
                style={{
                  background: classic || modern ? "var(--sp-primary)" : "#fff",
                  color: classic || modern ? "#fff" : "var(--sp-primary)",
                  borderRadius: "var(--sp-radius)",
                }}
              >
                {project.ctaText || "Ajánlatkérés"}
              </a>
            </Container>
          </div>
        ) : null}
      </header>

      {/* ---------------- Hero ---------------- */}
      <section
        className="relative overflow-hidden"
        style={{
          background: bold
            ? `linear-gradient(135deg, var(--sp-primary), var(--sp-accent))`
            : classic
              ? "#ffffff"
              : `linear-gradient(180deg, var(--sp-primary-soft), #ffffff)`,
          color: bold ? "#fff" : "#1f2937",
        }}
      >
        {!classic ? (
          <span
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: bold ? "#ffffff" : "var(--sp-accent)" }}
          />
        ) : null}

        <Container className="relative py-12">
          <div className={layout === "split" ? "grid items-center gap-8 @lg:grid-cols-2" : "text-center"}>
            <Section animated={animated} className={layout === "split" ? "" : "mx-auto max-w-lg"}>
              <span
                className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  background: bold ? "rgba(255,255,255,.18)" : "var(--sp-primary-tint)",
                  color: bold ? "#fff" : "var(--sp-primary)",
                }}
              >
                {project.activity || "Megbízható partner"}
              </span>
              <h1 className="mt-3 font-bold leading-[1.1]" style={{ fontSize: "2.2em" }}>
                {project.heroTitle || "Üdvözöljük vállalkozásunk oldalán"}
              </h1>
              <p className="mt-3 leading-relaxed opacity-90" style={{ fontSize: "1.05em" }}>
                {project.heroSubtitle ||
                  project.shortDescription ||
                  "Rövid, figyelemfelkeltő alcím a vállalkozásáról és arról, miért Önt válasszák."}
              </p>
              <div className={layout === "split" ? "mt-5 flex flex-wrap gap-2" : "mt-5 flex flex-wrap justify-center gap-2"}>
                <a
                  href="#contact"
                  className="px-4 py-2.5 text-xs font-semibold"
                  style={{
                    background: bold ? "#fff" : "var(--sp-primary)",
                    color: bold ? "var(--sp-primary)" : "#fff",
                    borderRadius: "var(--sp-radius)",
                  }}
                >
                  {project.ctaText || "Kapcsolatfelvétel"}
                </a>
                <a
                  href={project.pages.services ? "#services" : "#contact"}
                  className="px-4 py-2.5 text-xs font-semibold"
                  style={{
                    background: "transparent",
                    color: bold ? "#fff" : "var(--sp-primary)",
                    border: `1px solid ${bold ? "rgba(255,255,255,.5)" : "var(--sp-primary)"}`,
                    borderRadius: "var(--sp-radius)",
                  }}
                >
                  Tudjon meg többet
                </a>
              </div>
            </Section>

            {layout === "split" ? (
              <Section animated={animated} delay={120}>
                {project.heroImageUrl ? (
                  <div className="aspect-[4/3] w-full overflow-hidden shadow-xl" style={{ borderRadius: "var(--sp-radius)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.heroImageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <BrandedPanel name={project.companyName} radius={radius} label={project.activity || undefined} />
                )}
              </Section>
            ) : null}
          </div>

          {/* floating stats bar */}
          <Section animated={animated} delay={200} className="mt-10">
            <div
              className="mx-auto grid max-w-lg grid-cols-3 gap-3 p-4 text-center shadow-lg"
              style={{ background: "#fff", color: "#1f2937", borderRadius: "var(--sp-radius)", border: "1px solid #eef0f4" }}
            >
              {[
                ["10+", "év tapasztalat"],
                ["500+", "elégedett ügyfél"],
                ["4.9", "értékelés"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-bold" style={{ color: "var(--sp-primary)", fontSize: "1.3em" }}>
                    {v}
                  </p>
                  <p className="text-[10px] text-neutral-500">{l}</p>
                </div>
              ))}
            </div>
          </Section>
        </Container>
      </section>

      {/* ---------------- About ---------------- */}
      {project.pages.about ? (
        <section id="about" style={sectionScroll}>
          <Container className="py-14">
            <Section animated={animated}>
              <div className="grid items-center gap-8 @lg:grid-cols-2">
                <div className="overflow-hidden" style={{ borderRadius: "var(--sp-radius)" }}>
                  {project.galleryUrls[0] || project.heroImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.galleryUrls[0] || project.heroImageUrl || "/placeholder.svg"}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <BrandedPanel name={project.companyName} radius={radius} label="Rólunk" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--sp-accent)" }}>
                    Bemutatkozás
                  </p>
                  <h2 className="mt-1 font-bold" style={{ color: "#1f2937", fontSize: "1.6em" }}>
                    {project.aboutTitle || "Rólunk"}
                  </h2>
                  <p className="mt-3 leading-relaxed text-neutral-600">
                    {project.aboutText ||
                      project.shortDescription ||
                      "Itt mutathatja be vállalkozását, történetét és értékeit néhány meggyőző mondatban."}
                  </p>
                  <div className="mt-4 space-y-2">
                    {["Megbízható, határidőre kész munka", "Átlátható, korrekt árazás", "Személyre szabott megoldások"].map(
                      (t) => (
                        <div key={t} className="flex items-center gap-2 text-neutral-700">
                          <span
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
                            style={{ background: "var(--sp-primary)" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          {t}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Section>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Services ---------------- */}
      {project.pages.services && services.length ? (
        <section id="services" style={{ ...sectionScroll, background: "#f7f8fb" }}>
          <Container className="py-14">
            <Section animated={animated} className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--sp-accent)" }}>
                Amit kínálunk
              </p>
              <h2 className="mt-1 font-bold" style={{ color: "#1f2937", fontSize: "1.6em" }}>
                Szolgáltatásaink
              </h2>
            </Section>
            <div className="mt-8 grid gap-4 @md:grid-cols-2 @2xl:grid-cols-3">
              {services.map((s, i) => (
                <Section animated={animated} delay={i * 80} key={s.id}>
                  <div
                    className="h-full bg-white p-5 transition-transform hover:-translate-y-1"
                    style={{ borderRadius: "var(--sp-radius)", border: "1px solid #eef0f4", boxShadow: "0 10px 30px -22px rgba(0,0,0,.4)" }}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center text-sm font-bold text-white"
                      style={{ background: "var(--sp-primary)", borderRadius: "var(--sp-radius)" }}
                    >
                      {i + 1}
                    </span>
                    <p className="mt-3 font-semibold text-neutral-800">{s.title}</p>
                    <p className="mt-1 text-neutral-600">{s.text}</p>
                    {s.price ? (
                      <p className="mt-2 font-semibold" style={{ color: "var(--sp-accent)" }}>
                        {s.price}
                      </p>
                    ) : null}
                  </div>
                </Section>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Pricing ---------------- */}
      {project.pages.pricing && services.length ? (
        <section id="pricing" style={sectionScroll}>
          <Container className="py-14">
            <Section animated={animated} className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--sp-accent)" }}>
                Áraink
              </p>
              <h2 className="mt-1 font-bold" style={{ color: "#1f2937", fontSize: "1.6em" }}>
                Válasszon csomagot
              </h2>
            </Section>
            <div className="mx-auto mt-8 grid max-w-3xl gap-4 @xl:grid-cols-3">
              {services.slice(0, 3).map((s, i) => {
                const featured = i === 1
                return (
                  <Section animated={animated} delay={i * 80} key={s.id}>
                    <div
                      className="flex h-full flex-col p-5 text-center"
                      style={{
                        borderRadius: "var(--sp-radius)",
                        background: featured ? "var(--sp-primary)" : "#fff",
                        color: featured ? "#fff" : "#1f2937",
                        border: featured ? "none" : "1px solid #eef0f4",
                        boxShadow: featured ? "0 20px 40px -20px var(--sp-primary)" : "0 10px 30px -24px rgba(0,0,0,.4)",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{s.title}</p>
                      <p className="mt-2 font-bold" style={{ fontSize: "1.5em" }}>
                        {s.price || "Egyedi ár"}
                      </p>
                      <p className="mt-2 text-xs opacity-80">{s.text}</p>
                      <a
                        href="#contact"
                        className="mt-4 px-3 py-2 text-xs font-semibold"
                        style={{
                          background: featured ? "#fff" : "var(--sp-primary)",
                          color: featured ? "var(--sp-primary)" : "#fff",
                          borderRadius: "var(--sp-radius)",
                        }}
                      >
                        Kérek ajánlatot
                      </a>
                    </div>
                  </Section>
                )
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- References ---------------- */}
      {project.pages.references ? (
        <section id="references" style={{ ...sectionScroll, background: "var(--sp-primary-soft)" }}>
          <Container className="py-14">
            <Section animated={animated} className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--sp-accent)" }}>
                Vélemények
              </p>
              <h2 className="mt-1 font-bold" style={{ color: "#1f2937", fontSize: "1.6em" }}>
                Amit ügyfeleink mondanak
              </h2>
            </Section>
            <div className="mt-8 grid gap-4 @xl:grid-cols-3">
              {references.slice(0, 3).map((r, i) => (
                <Section animated={animated} delay={i * 80} key={i}>
                  <div className="h-full bg-white p-5" style={{ borderRadius: "var(--sp-radius)", border: "1px solid #eef0f4" }}>
                    <div className="flex gap-0.5" style={{ color: "var(--sp-accent)" }}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.8l1.2-6.6L2.5 9l6.6-.9L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-2 italic text-neutral-600">“{r}”</p>
                    <p className="mt-3 text-xs font-semibold text-neutral-800">{refNames[i] ?? "Elégedett ügyfél"}</p>
                  </div>
                </Section>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Gallery ---------------- */}
      {project.galleryUrls.length ? (
        <section id="gallery" style={sectionScroll}>
          <Container className="py-14">
            <Section animated={animated} className="text-center">
              <h2 className="font-bold" style={{ color: "#1f2937", fontSize: "1.6em" }}>
                Galéria
              </h2>
            </Section>
            <div className="mt-8 grid grid-cols-2 gap-3 @md:grid-cols-3">
              {project.galleryUrls.map((url, i) => (
                <Section animated={animated} delay={i * 60} key={i}>
                  <div className="aspect-square overflow-hidden bg-neutral-100" style={{ borderRadius: "var(--sp-radius)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url || "/placeholder.svg"} alt="" className="h-full w-full object-cover transition-transform hover:scale-105" />
                  </div>
                </Section>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Blog ---------------- */}
      {project.pages.blog ? (
        <section id="blog" style={{ ...sectionScroll, background: "#f7f8fb" }}>
          <Container className="py-14">
            <Section animated={animated} className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--sp-accent)" }}>
                Hírek
              </p>
              <h2 className="mt-1 font-bold" style={{ color: "#1f2937", fontSize: "1.6em" }}>
                Legfrissebb bejegyzések
              </h2>
            </Section>
            <div className="mt-8 grid gap-4 @xl:grid-cols-3">
              {[
                ["Tippek kezdő vállalkozóknak", "Így indítsa el vállalkozását magabiztosan."],
                ["Ügyfélszerzés 2026-ban", "A legjobb módszerek az első ügyfelek megtalálására."],
                ["Digitális jelenlét", "Miért fontos a saját weboldal a mai piacon?"],
              ].map(([t, d], i) => (
                <Section animated={animated} delay={i * 80} key={t}>
                  <div className="h-full overflow-hidden bg-white" style={{ borderRadius: "var(--sp-radius)", border: "1px solid #eef0f4" }}>
                    <div className="h-24" style={{ background: `linear-gradient(135deg, var(--sp-primary), var(--sp-accent))` }} />
                    <div className="p-4">
                      <p className="font-semibold text-neutral-800">{t}</p>
                      <p className="mt-1 text-xs text-neutral-500">{d}</p>
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Contact ---------------- */}
      {project.pages.contact ? (
        <section
          id="contact"
          style={{ ...sectionScroll, background: `linear-gradient(135deg, var(--sp-primary), var(--sp-accent))`, color: "#fff" }}
        >
          <Container className="py-14">
            <Section animated={animated}>
              <div className="grid gap-8 @lg:grid-cols-2">
                <div>
                  <h2 className="font-bold" style={{ fontSize: "1.6em" }}>
                    Lépjen kapcsolatba velünk
                  </h2>
                  <p className="mt-2 opacity-90">Kérdése van? Küldjön üzenetet, vagy hívjon minket bizalommal.</p>
                  <div className="mt-4 space-y-2 opacity-95">
                    {project.contact.phone ? (
                      <p className="flex items-center gap-2">
                        <ContactIcon d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.4.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.4 1 1 0 01-.25 1l-2.2 2.4z" />
                        {project.contact.phone}
                      </p>
                    ) : null}
                    {project.contact.email ? (
                      <p className="flex items-center gap-2">
                        <ContactIcon d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm0 3.2V19h16V7.2l-8 5-8-5zM18.6 6H5.4l6.6 4.1L18.6 6z" />
                        {project.contact.email}
                      </p>
                    ) : null}
                    {project.contact.address ? (
                      <p className="flex items-center gap-2">
                        <ContactIcon d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 4.5A2.5 2.5 0 1012 11.5 2.5 2.5 0 0012 6.5z" />
                        {project.contact.address}
                      </p>
                    ) : null}
                    {project.contact.hours ? (
                      <p className="flex items-center gap-2">
                        <ContactIcon d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 10.6l3.5 2-.9 1.6L11 13.5V6h2z" />
                        {project.contact.hours}
                      </p>
                    ) : null}
                  </div>
                </div>
                <form
                  className="space-y-2 bg-white/10 p-4 backdrop-blur"
                  style={{ borderRadius: "var(--sp-radius)" }}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    placeholder="Név"
                    className="w-full bg-white/90 px-3 py-2 text-xs text-neutral-800 outline-none placeholder:text-neutral-400"
                    style={{ borderRadius: "calc(var(--sp-radius) * 0.6)" }}
                  />
                  <input
                    placeholder="E-mail cím"
                    className="w-full bg-white/90 px-3 py-2 text-xs text-neutral-800 outline-none placeholder:text-neutral-400"
                    style={{ borderRadius: "calc(var(--sp-radius) * 0.6)" }}
                  />
                  <textarea
                    placeholder="Üzenet"
                    rows={3}
                    className="w-full resize-none bg-white/90 px-3 py-2 text-xs text-neutral-800 outline-none placeholder:text-neutral-400"
                    style={{ borderRadius: "calc(var(--sp-radius) * 0.6)" }}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 text-xs font-semibold"
                    style={{ background: "#fff", color: "var(--sp-primary)", borderRadius: "var(--sp-radius)" }}
                  >
                    Üzenet küldése
                  </button>
                </form>
              </div>
            </Section>
          </Container>
        </section>
      ) : null}

      {/* ---------------- Footer ---------------- */}
      <footer className="bg-neutral-900 text-neutral-300">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 @md:flex-row">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--sp-primary)", borderRadius: "var(--sp-radius)" }}
            >
              {initials(project.companyName || "Cég")}
            </span>
            <span className="text-sm font-semibold text-white">{project.companyName || "Vállalkozás"}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-xs">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-neutral-400 transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <p className="text-[10px] text-neutral-500">
            © {new Date().getFullYear()} {project.companyName || "Vállalkozás"}
          </p>
        </Container>
      </footer>
    </div>
  )
}
