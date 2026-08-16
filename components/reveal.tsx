"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right" | "none"

/**
 * Fade / slide in when the element scrolls into view.
 * Uses IntersectionObserver so it works for both landing and in-app pages.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as: Tag = "div",
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: Direction
  as?: React.ElementType
  once?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Respect reduced motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            if (once) obs.disconnect()
          } else if (!once) {
            setShown(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [once])

  const offset =
    direction === "up"
      ? "translate-y-6"
      : direction === "down"
        ? "-translate-y-6"
        : direction === "left"
          ? "translate-x-6"
          : direction === "right"
            ? "-translate-x-6"
            : ""

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        shown ? "opacity-100 translate-x-0 translate-y-0 blur-0" : cn("opacity-0 blur-[6px]", offset),
        className,
      )}
    >
      {children}
    </Tag>
  )
}
