"use client"

import { useState } from "react"
import { usePortal } from "@/components/portal-provider"
import { DevicePreview, type Device } from "@/components/device-preview"
import { ImageUploader } from "@/components/image-uploader"
import { Icon } from "@/components/icons"
import { extractPalette } from "@/lib/color"
import { cn } from "@/lib/utils"
import type { ServiceItem, SiteProject } from "@/lib/types"

const STEPS = [
  { n: 1, label: "Sablon és stílus" },
  { n: 2, label: "Tartalom" },
  { n: 3, label: "Képek" },
  { n: 4, label: "Kapcsolat és publikálás" },
]

const TEMPLATES: { id: SiteProject["template"]; name: string; desc: string }[] = [
  { id: "classic", name: "Klasszikus", desc: "Világos, letisztult, világos fejléc" },
  { id: "modern", name: "Modern", desc: "Lágy háttér, színes fejléc" },
  { id: "bold", name: "Bátor", desc: "Erős színátmenetes hero" },
]

const COLOR_PRESETS = [
  { primary: "#3743d8", accent: "#027671" },
  { primary: "#0e7a52", accent: "#b8791a" },
  { primary: "#8445db", accent: "#01719d" },
  { primary: "#c2374a", accent: "#3743d8" },
  { primary: "#01719d", accent: "#0e7a52" },
]

const field =
  "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"

const DEVICES: { id: Device; icon: keyof typeof Icon; label: string }[] = [
  { id: "desktop", icon: "monitor", label: "Asztali" },
  { id: "tablet", icon: "tablet", label: "Tablet" },
  { id: "mobile", icon: "phone", label: "Mobil" },
]

export default function WebsiteBuilderPage() {
  const { currentProject, updateProject } = usePortal()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [device, setDevice] = useState<Device>("desktop")
  const [extracting, setExtracting] = useState(false)
  const [paletteMsg, setPaletteMsg] = useState<string | null>(null)

  if (!currentProject) return null
  const p = currentProject
  const step = Math.min(Math.max(p.currentStep, 1), 4)

  const goStep = (n: number) => updateProject({ currentStep: n })

  const addService = () => {
    const s: ServiceItem = { id: `svc-${Date.now()}`, title: "Új szolgáltatás", text: "Rövid leírás", price: "" }
    updateProject({ services: [...p.services, s] })
  }
  const updateService = (id: string, patch: Partial<ServiceItem>) =>
    updateProject({ services: p.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  const removeService = (id: string) => updateProject({ services: p.services.filter((s) => s.id !== id) })

  const addReference = () => updateProject({ references: [...p.references, "Kiváló munka, csak ajánlani tudom!"] })
  const updateReference = (i: number, val: string) =>
    updateProject({ references: p.references.map((r, idx) => (idx === i ? val : r)) })
  const removeReference = (i: number) =>
    updateProject({ references: p.references.filter((_, idx) => idx !== i) })

  const togglePage = (key: keyof SiteProject["pages"]) =>
    updateProject({ pages: { ...p.pages, [key]: !p.pages[key] } })

  const publish = () => updateProject({ status: "published", publishedAt: new Date().toISOString(), currentStep: 4 })

  const grabLogoColors = async () => {
    if (!p.logoUrl) return
    setExtracting(true)
    setPaletteMsg(null)
    const palette = await extractPalette(p.logoUrl)
    setExtracting(false)
    if (palette) {
      updateProject({ primaryColor: palette.primary, accentColor: palette.accent })
      setPaletteMsg("Színek beállítva a logó alapján.")
    } else {
      setPaletteMsg("Nem sikerült színt kinyerni ebből a logóból.")
    }
  }

  const DeviceToggle = ({ compact = false }: { compact?: boolean }) => (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {DEVICES.map((d) => {
        const DeviceIcon = Icon[d.icon]
        return (
          <button
            key={d.id}
            onClick={() => setDevice(d.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              device === d.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={d.label}
            aria-pressed={device === d.id}
          >
            <DeviceIcon width={15} height={15} />
            {!compact ? <span className="hidden sm:inline">{d.label}</span> : null}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Online megjelenés</h1>
          <p className="mt-1 text-sm text-muted-foreground">Testreszabható weboldal a vállalkozásának, élő előnézettel.</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              p.status === "published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", p.status === "published" ? "bg-success" : "bg-muted-foreground")} />
            {p.status === "published" ? "Publikálva" : "Vázlat"}
          </span>
          <a
            href={`/s/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Icon.external width={14} height={14} />
            <span className="hidden sm:inline">Élő nézet</span>
          </a>
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted lg:hidden"
          >
            <Icon.play width={14} height={14} />
            Előnézet
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button
            key={s.n}
            onClick={() => goStep(s.n)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              step === s.n ? "bg-primary text-primary-foreground" : step > s.n ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-xs", step === s.n ? "bg-primary-foreground/20" : "bg-black/5")}>
              {step > s.n ? <Icon.check width={12} height={12} /> : s.n}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
            {i < STEPS.length - 1 ? <span className="text-muted-foreground/50">›</span> : null}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_440px]">
        {/* Editor */}
        <div className="glass-panel rounded-2xl p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Sablon</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateProject({ template: t.id })}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        p.template === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50",
                      )}
                    >
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Színpaletta</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.primary}
                      onClick={() => updateProject({ primaryColor: c.primary, accentColor: c.accent })}
                      className={cn(
                        "flex h-10 w-16 overflow-hidden rounded-lg border-2",
                        p.primaryColor === c.primary ? "border-foreground" : "border-transparent",
                      )}
                      aria-label="Színséma"
                    >
                      <span className="flex-1" style={{ background: c.primary }} />
                      <span className="w-1/3" style={{ background: c.accent }} />
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    Fő szín
                    <input type="color" value={p.primaryColor} onChange={(e) => updateProject({ primaryColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-border bg-card" />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    Kiemelő
                    <input type="color" value={p.accentColor} onChange={(e) => updateProject({ accentColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-border bg-card" />
                  </label>
                  {p.logoUrl ? (
                    <button
                      onClick={grabLogoColors}
                      disabled={extracting}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/15 disabled:opacity-50"
                    >
                      <Icon.palette width={15} height={15} />
                      {extracting ? "Kinyerés…" : "Színek a logóból"}
                    </button>
                  ) : null}
                </div>
                {paletteMsg ? <p className="mt-2 text-xs text-muted-foreground">{paletteMsg}</p> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Elrendezés</h3>
                  <div className="mt-2 flex gap-2">
                    {(["split", "stacked"] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => updateProject({ layout: l })}
                        className={cn("flex-1 rounded-lg border px-3 py-2 text-sm", p.layout === l ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground")}
                      >
                        {l === "split" ? "Osztott" : "Középre zárt"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Sarok lekerekítés: {p.radius}px</h3>
                  <input type="range" min={0} max={28} value={p.radius} onChange={(e) => updateProject({ radius: Number(e.target.value) })} className="mt-3 w-full accent-primary" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Betűméret: {p.fontScale.toFixed(2)}×</h3>
                <input type="range" min={0.9} max={1.2} step={0.05} value={p.fontScale} onChange={(e) => updateProject({ fontScale: Number(e.target.value) })} className="mt-2 w-full accent-primary" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Megjelenítendő menüpontok</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Kapcsolja be, mely oldalak jelenjenek meg a weboldalon.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      ["about", "Rólunk"],
                      ["services", "Szolgáltatások"],
                      ["pricing", "Árak"],
                      ["references", "Referenciák"],
                      ["blog", "Blog"],
                      ["contact", "Kapcsolat"],
                    ] as [keyof SiteProject["pages"], string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => togglePage(key)}
                      className={cn("rounded-full px-3 py-1.5 text-sm font-medium", p.pages[key] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-bold text-foreground">Tartalom</h2>
              <div className="grid gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Cégnév</label>
                  <input className={field} value={p.companyName} onChange={(e) => updateProject({ companyName: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Tevékenység / szakterület</label>
                  <input className={field} value={p.activity} onChange={(e) => updateProject({ activity: e.target.value })} placeholder="pl. Fodrászat, Könyvelés" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Hero cím</label>
                  <input className={field} value={p.heroTitle} onChange={(e) => updateProject({ heroTitle: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Hero alcím</label>
                  <input className={field} value={p.heroSubtitle} onChange={(e) => updateProject({ heroSubtitle: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Gomb szövege</label>
                  <input className={field} value={p.ctaText} onChange={(e) => updateProject({ ctaText: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">„Rólunk” cím</label>
                  <input className={field} value={p.aboutTitle} onChange={(e) => updateProject({ aboutTitle: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">„Rólunk” szöveg</label>
                  <textarea rows={3} className={cn(field, "resize-none")} value={p.aboutText} onChange={(e) => updateProject({ aboutText: e.target.value })} />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Szolgáltatások</h3>
                  <button onClick={addService} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/15">
                    + Hozzáadás
                  </button>
                </div>
                <div className="space-y-3">
                  {p.services.map((s) => (
                    <div key={s.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-center gap-2">
                        <input className={field} value={s.title} onChange={(e) => updateService(s.id, { title: e.target.value })} placeholder="Szolgáltatás neve" />
                        <button onClick={() => removeService(s.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger" aria-label="Törlés">
                          <Icon.close width={16} height={16} />
                        </button>
                      </div>
                      <textarea rows={2} className={cn(field, "mt-2 resize-none")} value={s.text} onChange={(e) => updateService(s.id, { text: e.target.value })} placeholder="Rövid leírás" />
                      <input className={cn(field, "mt-2")} value={s.price} onChange={(e) => updateService(s.id, { price: e.target.value })} placeholder="Ár (pl. 15 000 Ft-tól)" />
                    </div>
                  ))}
                  {!p.services.length ? <p className="text-sm text-muted-foreground">Még nincs szolgáltatás. Adjon hozzá legalább kettőt a jobb online megjelenés-pontszámért.</p> : null}
                </div>
              </div>

              {/* References editor (only when the Referenciák page is enabled) */}
              {p.pages.references ? (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Referenciák / vélemények</h3>
                    <button onClick={addReference} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/15">
                      + Hozzáadás
                    </button>
                  </div>
                  <div className="space-y-2">
                    {p.references.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          className={cn(field, "resize-none")}
                          value={r}
                          onChange={(e) => updateReference(i, e.target.value)}
                          placeholder="Ügyfél véleménye"
                        />
                        <button onClick={() => removeReference(i)} className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-danger/10 hover:text-danger" aria-label="Törlés">
                          <Icon.close width={16} height={16} />
                        </button>
                      </div>
                    ))}
                    {!p.references.length ? (
                      <p className="text-sm text-muted-foreground">
                        Nincs saját vélemény megadva – addig minta vélemények jelennek meg az oldalon.
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-bold text-foreground">Képek feltöltése</h2>
              <div>
                <ImageUploader
                  value={p.logoUrl}
                  onUploaded={(url) => updateProject({ logoUrl: url })}
                  onRemove={() => updateProject({ logoUrl: null })}
                  folder="sites"
                  label="Logó"
                  aspect="logo"
                />
                {p.logoUrl ? (
                  <button
                    onClick={grabLogoColors}
                    disabled={extracting}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/15 disabled:opacity-50"
                  >
                    <Icon.palette width={15} height={15} />
                    {extracting ? "Színek kinyerése…" : "Színpaletta a logóból"}
                  </button>
                ) : null}
                {paletteMsg ? <p className="mt-2 text-xs text-muted-foreground">{paletteMsg}</p> : null}
              </div>
              <ImageUploader
                value={p.heroImageUrl}
                onUploaded={(url) => updateProject({ heroImageUrl: url })}
                onRemove={() => updateProject({ heroImageUrl: null })}
                folder="sites"
                label="Főkép (hero)"
                aspect="wide"
              />
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Galéria</p>
                <div className="grid grid-cols-3 gap-3">
                  {p.galleryUrls.map((url, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => updateProject({ galleryUrls: p.galleryUrls.filter((_, idx) => idx !== i) })}
                        className="absolute right-1 top-1 rounded-md bg-foreground/60 p-1 text-white opacity-0 backdrop-blur group-hover:opacity-100"
                        aria-label="Kép törlése"
                      >
                        <Icon.close width={14} height={14} />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square">
                    <ImageUploader
                      onUploaded={(url) => updateProject({ galleryUrls: [...p.galleryUrls, url] })}
                      folder="sites/gallery"
                      label=""
                      aspect="square"
                      hint="Kép hozzáadása"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-bold text-foreground">Kapcsolat és publikálás</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Telefonszám</label>
                  <input className={field} value={p.contact.phone} onChange={(e) => updateProject({ contact: { ...p.contact, phone: e.target.value } })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
                  <input className={field} value={p.contact.email} onChange={(e) => updateProject({ contact: { ...p.contact, email: e.target.value } })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Cím</label>
                  <input className={field} value={p.contact.address} onChange={(e) => updateProject({ contact: { ...p.contact, address: e.target.value } })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Nyitvatartás</label>
                  <input className={field} value={p.contact.hours} onChange={(e) => updateProject({ contact: { ...p.contact, hours: e.target.value } })} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon.globe width={18} height={18} className="text-primary" />
                  Az oldal címe
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  vallalkozoiportal.hu/s/<span className="font-medium text-foreground">{p.slug}</span>
                </p>
                <a
                  href={`/s/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <Icon.external width={15} height={15} />
                  Weboldal megnyitása élőben
                </a>
              </div>

              {p.status === "published" ? (
                <div className="rounded-xl bg-success/10 p-4 text-sm text-success">
                  Az oldal publikálva. A módosítások mentése után frissítheti újra.
                </div>
              ) : null}

              <button
                onClick={publish}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                <Icon.check width={16} height={16} />
                {p.status === "published" ? "Módosítások publikálása" : "Weboldal publikálása"}
              </button>
            </div>
          ) : null}

          {/* Nav buttons */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <button
              onClick={() => goStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40"
            >
              Vissza
            </button>
            {step < 4 ? (
              <button onClick={() => goStep(step + 1)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
                Tovább
                <Icon.arrowRight width={16} height={16} />
              </button>
            ) : null}
          </div>
        </div>

        {/* Live preview (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Élő előnézet</p>
              <div className="flex items-center gap-2">
                <DeviceToggle compact />
                <button
                  onClick={() => setPreviewOpen(true)}
                  className="rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground"
                  aria-label="Teljes képernyős előnézet"
                >
                  <Icon.external width={15} height={15} />
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-neutral-100 p-3 shadow-xl dark:bg-neutral-900">
              <div className="h-[600px]">
                <DevicePreview project={p} device={device} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen / mobile preview modal */}
      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-foreground/60 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 bg-card px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Élő előnézet</p>
            <div className="flex items-center gap-2">
              <DeviceToggle />
              <a
                href={`/s/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Icon.external width={14} height={14} />
                <span className="hidden sm:inline">Új lapon</span>
              </a>
              <button onClick={() => setPreviewOpen(false)} className="rounded-lg p-2 text-foreground hover:bg-muted" aria-label="Bezárás">
                <Icon.close />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-neutral-100 p-4 dark:bg-neutral-900">
            <DevicePreview project={p} device={device} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
