"use client"

import { useEffect, useState } from "react"
import { usePortal } from "@/components/portal-provider"
import { ImageUploader } from "@/components/image-uploader"
import { Icon } from "@/components/icons"
import { initials } from "@/lib/utils"
import type { Company } from "@/lib/types"

const FIELDS: { key: keyof Company; label: string; placeholder: string; type?: string; full?: boolean }[] = [
  { key: "name", label: "Vállalkozás neve", placeholder: "Pl. Anna Kézműves Kft." },
  { key: "activity", label: "Fő tevékenység", placeholder: "Pl. Kézműves ajándéktárgyak" },
  { key: "taxNumber", label: "Adószám", placeholder: "12345678-1-42" },
  { key: "registrationNumber", label: "Cégjegyzék / nyilv. szám", placeholder: "01-09-123456" },
  { key: "headquarters", label: "Székhely", placeholder: "1052 Budapest, Fő utca 1." },
  { key: "phone", label: "Telefonszám", placeholder: "+36 30 123 4567" },
  { key: "email", label: "E-mail cím", placeholder: "info@pelda.hu", type: "email" },
  { key: "website", label: "Weboldal", placeholder: "https://pelda.hu" },
  { key: "contactName", label: "Kapcsolattartó neve", placeholder: "Kovács Anna" },
]

export default function ProfilePage() {
  const { currentCompany, updateCompany, ladder } = usePortal()
  const [draft, setDraft] = useState<Partial<Company>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (currentCompany) setDraft(currentCompany)
  }, [currentCompany])

  if (!currentCompany) return null

  const set = (k: keyof Company, v: string) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setSaved(false)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    updateCompany(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const profilePct = ladder.metrics.find((m) => m.key === "profile")?.value ?? 0

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Vállalkozási profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A pontos adatok és a logó egységes, hiteles megjelenést adnak – és javítják a vállalkozói indexét.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Logo + completeness */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {currentCompany.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentCompany.logoUrl || "/placeholder.svg"} alt="Logó" className="h-full w-full object-cover" />
                ) : (
                  initials(draft.name || currentCompany.name)
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Céglogó</p>
                <p className="text-xs text-muted-foreground">Megjelenik a weboldalán is</p>
              </div>
            </div>
            <ImageUploader
              value={currentCompany.logoUrl}
              onUploaded={(url) => updateCompany({ logoUrl: url })}
              onRemove={() => updateCompany({ logoUrl: null })}
              folder="logos"
              label=""
              aspect="logo"
              hint="Négyzetes vagy fekvő logó, max. 5 MB"
            />
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Profil kitöltöttsége</span>
              <span className="text-sm font-bold text-primary">{profilePct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${profilePct}%` }} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Töltse ki az összes mezőt és töltsön fel logót a teljes pontszámért.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="glass-panel rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                <label htmlFor={f.key} className="mb-1.5 block text-sm font-medium text-foreground">
                  {f.label}
                </label>
                <input
                  id={f.key}
                  type={f.type ?? "text"}
                  value={(draft[f.key] as string) ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
                Rövid bemutatkozás
              </label>
              <textarea
                id="description"
                rows={4}
                value={draft.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Néhány mondat a vállalkozásáról, amit a weboldalán is felhasználhat…"
                className="w-full resize-none rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              <Icon.check width={16} height={16} />
              Adatok mentése
            </button>
            {saved ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                <Icon.check width={16} height={16} />
                Elmentve
              </span>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}
