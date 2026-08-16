import Link from "next/link"
import { Icon } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon.shield width={20} height={20} />
              </span>
              <span className="font-display text-sm font-bold text-foreground">Vállalkozói Portál</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Ingyenes digitális platform a kezdő magyar vállalkozások indításához és fejlődéséhez.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Szolgáltatások</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/regisztracio" className="hover:text-foreground">Edukáció</Link></li>
              <li><Link href="/regisztracio" className="hover:text-foreground">Online megjelenés</Link></li>
              <li><Link href="/regisztracio" className="hover:text-foreground">Irodai készségek</Link></li>
              <li><Link href="/regisztracio" className="hover:text-foreground">Vállalkozói index</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Információ</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">A programról</Link></li>
              <li><Link href="/help" className="hover:text-foreground">Súgó és GYIK</Link></li>
              <li><Link href="/help" className="hover:text-foreground">Kapcsolat</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Jogi</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">Adatvédelmi tájékoztató</span></li>
              <li><span className="cursor-default">Felhasználási feltételek</span></li>
              <li><span className="cursor-default">Akadálymentesség</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Vállalkozói Portál. Demonstrációs felület.</p>
          <p>Minden adat a böngészőben, helyben tárolódik.</p>
        </div>
      </div>
    </footer>
  )
}
