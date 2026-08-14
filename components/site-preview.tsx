"use client"

import type { SiteProject } from "@/lib/types"
import { initials } from "@/lib/utils"

export function SitePreview({ project }: { project: SiteProject }) {
  const { primaryColor, accentColor, radius, fontScale, layout, template } = project

  const style = {
    "--sp-primary": primaryColor,
    "--sp-accent": accentColor,
    "--sp-radius": `${radius}px`,
    fontSize: `${14 * fontScale}px`,
  } as React.CSSProperties

  const bold = template === "bold"
  const classic = template === "classic"

  return (
    <div style={style} className="h-full overflow-y-auto bg-white text-neutral-800">
      {/* Nav */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3"
        style={{ background: classic ? "#ffffff" : "var(--sp-primary)", borderBottom: classic ? "1px solid #e5e7eb" : "none" }}
      >
        <div className="flex items-center gap-2" style={{ color: classic ? "var(--sp-primary)" : "#fff" }}>
          {project.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.logoUrl || "/placeholder.svg"} alt="" className="h-7 w-auto max-w-[120px] object-contain" />
          ) : (
            <span
              className="flex h-7 w-7 items-center justify-center text-xs font-bold"
              style={{ background: classic ? "var(--sp-primary)" : "rgba(255,255,255,.2)", color: "#fff", borderRadius: "var(--sp-radius)" }}
            >
              {initials(project.companyName || "Cég")}
            </span>
          )}
          <span className="font-semibold">{project.companyName || "Az Ön vállalkozása"}</span>
        </div>
        <nav className="hidden gap-3 text-xs sm:flex" style={{ color: classic ? "#4b5563" : "rgba(255,255,255,.9)" }}>
          {project.pages.about ? <span>Rólunk</span> : null}
          {project.pages.services ? <span>Szolgáltatások</span> : null}
          {project.pages.pricing ? <span>Árak</span> : null}
          {project.pages.contact ? <span>Kapcsolat</span> : null}
        </nav>
      </header>

      {/* Hero */}
      <section
        className={layout === "split" ? "grid items-center gap-4 px-5 py-8 sm:grid-cols-2" : "px-5 py-10 text-center"}
        style={{
          background: bold
            ? `linear-gradient(135deg, var(--sp-primary), var(--sp-accent))`
            : classic
              ? "#f8fafc"
              : `color-mix(in oklab, var(--sp-primary) 8%, white)`,
          color: bold ? "#fff" : "#1f2937",
        }}
      >
        <div className={layout === "split" ? "" : "mx-auto max-w-md"}>
          <h1 className="font-bold leading-tight" style={{ fontSize: "1.9em" }}>
            {project.heroTitle || "Üdvözöljük vállalkozásunk oldalán"}
          </h1>
          <p className="mt-2 opacity-90" style={{ fontSize: "1em" }}>
            {project.heroSubtitle || project.shortDescription || "Rövid, figyelemfelkeltő alcím a vállalkozásáról."}
          </p>
          <button
            className="mt-4 px-4 py-2 text-xs font-semibold text-white"
            style={{ background: bold ? "#fff" : "var(--sp-primary)", color: bold ? "var(--sp-primary)" : "#fff", borderRadius: "var(--sp-radius)" }}
          >
            {project.ctaText || "Kapcsolatfelvétel"}
          </button>
        </div>
        {layout === "split" ? (
          <div
            className="aspect-[4/3] w-full overflow-hidden bg-neutral-200"
            style={{ borderRadius: "var(--sp-radius)" }}
          >
            {project.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.heroImageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">Főkép helye</div>
            )}
          </div>
        ) : null}
      </section>

      {/* About */}
      {project.pages.about ? (
        <section className="px-5 py-7">
          <h2 className="font-bold" style={{ color: "var(--sp-primary)", fontSize: "1.3em" }}>
            {project.aboutTitle || "Rólunk"}
          </h2>
          <p className="mt-2 leading-relaxed text-neutral-600">
            {project.aboutText || project.shortDescription || "Itt mutathatja be vállalkozását, történetét és értékeit."}
          </p>
        </section>
      ) : null}

      {/* Services */}
      {project.pages.services && project.services.length ? (
        <section className="px-5 py-7" style={{ background: "#f8fafc" }}>
          <h2 className="font-bold" style={{ color: "var(--sp-primary)", fontSize: "1.3em" }}>
            Szolgáltatásaink
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {project.services.map((s) => (
              <div key={s.id} className="bg-white p-3" style={{ borderRadius: "var(--sp-radius)", border: "1px solid #e5e7eb" }}>
                <p className="font-semibold text-neutral-800">{s.title}</p>
                <p className="mt-1 text-neutral-600">{s.text}</p>
                {s.price ? (
                  <p className="mt-2 font-semibold" style={{ color: "var(--sp-accent)" }}>
                    {s.price}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {project.galleryUrls.length ? (
        <section className="px-5 py-7">
          <h2 className="font-bold" style={{ color: "var(--sp-primary)", fontSize: "1.3em" }}>
            Galéria
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {project.galleryUrls.map((url, i) => (
              <div key={i} className="aspect-square overflow-hidden bg-neutral-100" style={{ borderRadius: "var(--sp-radius)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Contact */}
      {project.pages.contact ? (
        <section className="px-5 py-7" style={{ background: "var(--sp-primary)", color: "#fff" }}>
          <h2 className="font-bold" style={{ fontSize: "1.3em" }}>
            Kapcsolat
          </h2>
          <div className="mt-2 space-y-1 opacity-90">
            {project.contact.phone ? <p>Telefon: {project.contact.phone}</p> : null}
            {project.contact.email ? <p>E-mail: {project.contact.email}</p> : null}
            {project.contact.address ? <p>Cím: {project.contact.address}</p> : null}
            {project.contact.hours ? <p>Nyitvatartás: {project.contact.hours}</p> : null}
          </div>
        </section>
      ) : null}

      <footer className="px-5 py-4 text-center text-[10px] text-neutral-400">
        © {new Date().getFullYear()} {project.companyName || "Vállalkozás"} — Vállalkozói Portál
      </footer>
    </div>
  )
}
