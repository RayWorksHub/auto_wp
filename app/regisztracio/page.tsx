"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"
import { AuthFrame } from "@/components/auth-frame"

export default function RegisterPage() {
  const { register } = usePortal()
  const router = useRouter()
  const [form, setForm] = useState({ name: "", companyName: "", email: "", password: "", password2: "" })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (form.password.length < 6) {
      setError("A jelszónak legalább 6 karakternek kell lennie.")
      return
    }
    if (form.password !== form.password2) {
      setError("A két jelszó nem egyezik.")
      return
    }
    setBusy(true)
    const res = register({
      name: form.name,
      companyName: form.companyName,
      email: form.email,
      password: form.password,
    })
    if (res.ok) {
      router.push("/app")
    } else {
      setError(res.message ?? "A regisztráció nem sikerült.")
      setBusy(false)
    }
  }

  const field =
    "w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"

  return (
    <AuthFrame
      title="Vállalkozói regisztráció"
      subtitle="Hozza létre ingyenes fiókját és kezdje el a digitális fejlődést."
      wide
      footer={
        <p className="text-sm text-muted-foreground">
          Már van fiókja?{" "}
          <Link href="/belepes" className="font-semibold text-primary hover:underline">
            Jelentkezzen be
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
              Az Ön neve
            </label>
            <input id="name" required value={form.name} onChange={update("name")} placeholder="Kovács Anna" className={field} />
          </div>
          <div>
            <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-foreground">
              Vállalkozás neve
            </label>
            <input id="company" required value={form.companyName} onChange={update("companyName")} placeholder="Pl. Anna Kézműves" className={field} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            E-mail cím
          </label>
          <input id="email" type="email" required value={form.email} onChange={update("email")} placeholder="valaki@pelda.hu" className={field} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              Jelszó
            </label>
            <input id="password" type="password" required value={form.password} onChange={update("password")} placeholder="Legalább 6 karakter" className={field} />
          </div>
          <div>
            <label htmlFor="password2" className="mb-1.5 block text-sm font-medium text-foreground">
              Jelszó megerősítése
            </label>
            <input id="password2" type="password" required value={form.password2} onChange={update("password2")} placeholder="••••••••" className={field} />
          </div>
        </div>

        {error ? (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-muted-foreground">
          A regisztrációval elfogadja a felhasználási feltételeket és az adatvédelmi tájékoztatót. Ez egy demonstrációs
          felület – az adatok kizárólag a böngészőjében tárolódnak.
        </p>

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {busy ? "Fiók létrehozása…" : "Fiók létrehozása"}
          {!busy ? <Icon.arrowRight width={16} height={16} /> : null}
        </button>
      </form>
    </AuthFrame>
  )
}
