"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"
import { AuthFrame } from "@/components/auth-frame"

export default function LoginPage() {
  const { login, loginDemo } = usePortal()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = login(email, password)
    if (res.ok) {
      router.push("/app")
    } else {
      setError(res.message ?? "Sikertelen bejelentkezés.")
      setBusy(false)
    }
  }

  return (
    <AuthFrame
      title="Bejelentkezés"
      subtitle="Lépjen be a vállalkozói fiókjába a szolgáltatások eléréséhez."
      footer={
        <p className="text-sm text-muted-foreground">
          Még nincs fiókja?{" "}
          <Link href="/regisztracio" className="font-semibold text-primary hover:underline">
            Regisztráljon most
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            E-mail cím
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="valaki@pelda.hu"
            className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Jelszó
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {busy ? "Bejelentkezés…" : "Bejelentkezés"}
          {!busy ? <Icon.arrowRight width={16} height={16} /> : null}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        vagy
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        onClick={() => {
          loginDemo()
          router.push("/app")
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <Icon.sparkle width={16} height={16} className="text-primary" />
        Belépés a demó fiókba
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Előre kitöltött vállalkozás, kurzus-előzmények és weboldal-terv.
      </p>
    </AuthFrame>
  )
}
