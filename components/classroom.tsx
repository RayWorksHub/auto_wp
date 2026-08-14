"use client"

import { useState } from "react"
import Link from "next/link"
import { usePortal } from "@/components/portal-provider"
import { Icon } from "@/components/icons"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types"

export function Classroom({ course, backHref, backLabel }: { course: Course; backHref: string; backLabel: string }) {
  const { progress, toggleLesson } = usePortal()
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstUndone = course.lessons.findIndex((l) => !progress[l.id])
    return firstUndone === -1 ? 0 : firstUndone
  })

  const lesson = course.lessons[activeIndex]
  const done = course.lessons.filter((l) => progress[l.id]).length
  const total = course.lessons.length
  const pct = total ? Math.round((done / total) * 100) : 0
  const isDone = lesson ? !!progress[lesson.id] : false

  const completeAndNext = () => {
    if (!lesson) return
    toggleLesson(lesson.id, true)
    if (activeIndex < total - 1) setActiveIndex((i) => i + 1)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link href={backHref} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <span className="rotate-180"><Icon.arrowRight width={16} height={16} /></span>
        {backLabel}
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded px-2 py-0.5 font-medium" style={{ background: `${course.color}1a`, color: course.color }}>
            {course.product ?? course.level}
          </span>
          <span>{course.duration}</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-foreground">{course.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{course.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Player */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
            <div className="aspect-video w-full">
              {lesson?.youtubeId ? (
                <iframe
                  key={lesson.id}
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?rel=0`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a
                  href={lesson?.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full flex-col items-center justify-center gap-3 bg-neutral-900 text-center text-neutral-300"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                    <Icon.play width={26} height={26} />
                  </span>
                  <span className="max-w-xs text-sm">
                    Ehhez a leckéhez ajánlott videó a YouTube-on nyílik meg. (Előkészített tananyaghely.)
                  </span>
                </a>
              )}
            </div>
          </div>

          {lesson ? (
            <div className="mt-5 glass-panel rounded-2xl p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{activeIndex + 1}. lecke · {lesson.duration}</p>
                  <h2 className="mt-1 font-display text-lg font-bold text-foreground">{lesson.title}</h2>
                </div>
                {isDone ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <Icon.check width={14} height={14} />
                    Teljesítve
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lesson.description}</p>

              {lesson.keyPoints?.length ? (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">Amit megtanul</p>
                  <ul className="mt-2 space-y-2">
                    {lesson.keyPoints.map((k, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon.check width={16} height={16} className="mt-0.5 shrink-0 text-primary" />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="mt-4 text-xs text-muted-foreground">Forrás: {lesson.source}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={completeAndNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
                >
                  <Icon.check width={16} height={16} />
                  {activeIndex < total - 1 ? "Kész, következő lecke" : "Lecke teljesítése"}
                </button>
                {isDone ? (
                  <button
                    onClick={() => toggleLesson(lesson.id, false)}
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    Jelölés visszavonása
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Lesson list */}
        <aside>
          <div className="sticky top-24 glass-panel rounded-2xl p-5">
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Haladás</span>
                <span className="text-muted-foreground">{done}/{total}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: course.color }} />
              </div>
            </div>

            <ol className="space-y-1">
              {course.lessons.map((l, i) => {
                const lDone = !!progress[l.id]
                const activeL = i === activeIndex
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => setActiveIndex(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        activeL ? "bg-primary/10" : "hover:bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          lDone ? "bg-success text-success-foreground" : activeL ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {lDone ? <Icon.check width={13} height={13} /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block truncate text-sm", activeL ? "font-semibold text-foreground" : "text-foreground")}>{l.title}</span>
                        <span className="block text-xs text-muted-foreground">{l.duration}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            {course.downloadable ? (
              <div className="mt-4 rounded-xl border border-dashed border-border p-3">
                <p className="text-xs font-medium text-foreground">Letölthető segédanyag</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{course.downloadable}</p>
                <button className="mt-2 text-xs font-semibold text-primary hover:underline">Letöltés (demó)</button>
              </div>
            ) : null}

            {pct === 100 ? (
              <div className="mt-4 rounded-xl bg-success/10 p-3 text-center text-sm font-medium text-success">
                Gratulálunk, elvégezte a kurzust!
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  )
}
