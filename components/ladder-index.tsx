"use client"

import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"

export function LadderIndex({ compact = false }: { compact?: boolean }) {
  const { ladder } = usePortal()

  const circumference = 2 * Math.PI * 52
  const dash = (ladder.score / 100) * circumference

  return (
    <section className="glass-panel rounded-2xl p-6" aria-label="Kezdő vállalkozói ranglétra">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon.ladder className="text-primary" />
        Kezdő vállalkozói ranglétra
      </div>

      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-muted)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{ladder.score}</span>
            <span className="text-xs text-muted-foreground">/ 100 pont</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-sm font-semibold text-primary">
              {ladder.level}. szint
            </span>
            <span className="text-base font-semibold text-foreground">{ladder.levelLabel}</span>
          </div>
          {ladder.nextLabel ? (
            <p className="mt-1.5 text-sm text-muted-foreground">
              Következő cél: <span className="font-medium text-foreground">{ladder.nextLabel}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-secondary">Elérte a legmagasabb szintet. Gratulálunk!</p>
          )}

          {!compact ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ladder.metrics.map((m) => (
                <div key={m.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-medium text-foreground">{m.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-700"
                      style={{ width: `${m.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
