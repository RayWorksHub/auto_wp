"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FAQS } from "@/lib/seed"
import { Icon } from "@/components/icons"

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
          <div className="mx-auto max-w-4xl px-4 py-16">
            <p className="text-sm font-medium text-primary">Súgó és támogatás</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-balance">
              Gyakori kérdések
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              A leggyakoribb kérdések a portál használatáról. Ha nem találod a választ, keresd ügyfélszolgálatunkat.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
            {FAQS.map((faq, i) => {
              const isOpen = open === i
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <span className={`shrink-0 text-primary transition-transform ${isOpen ? "rotate-45" : ""}`}>
                      <Icon.plus width={20} height={20} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 -mt-1">
                      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 glass-panel flex flex-col items-start gap-3 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold">Nem találod a választ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ügyfélszolgálatunk munkanapokon 8:00–16:00 között elérhető.</p>
            </div>
            <a
              href="mailto:ugyfelszolgalat@vallalkozoiportal.hu"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Icon.mail width={16} height={16} />
              Kapcsolatfelvétel
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
