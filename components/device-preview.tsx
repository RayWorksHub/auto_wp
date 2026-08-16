"use client"

import { useEffect, useRef, useState } from "react"
import { SitePreview } from "@/components/site-preview"
import { cn } from "@/lib/utils"
import type { SiteProject } from "@/lib/types"

export type Device = "desktop" | "tablet" | "mobile"

const DEVICE_WIDTH: Record<Device, number> = {
  desktop: 1180,
  tablet: 768,
  mobile: 390,
}

/**
 * Renders SitePreview at the true pixel width of the chosen device, then scales
 * it down (transform) to fit the available container. Because SitePreview uses
 * container queries, the layout genuinely reflows for each device.
 */
export function DevicePreview({
  project,
  device,
  animated = false,
  className,
}: {
  project: SiteProject
  device: Device
  animated?: boolean
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const dw = DEVICE_WIDTH[device]
  const scale = size.w ? Math.min(1, size.w / dw) : 1
  const scaledW = dw * scale
  const innerH = scale ? size.h / scale : size.h
  const left = Math.max(0, (size.w - scaledW) / 2)

  const rounded = device === "mobile" ? "rounded-[2rem]" : device === "tablet" ? "rounded-2xl" : "rounded-xl"

  return (
    <div ref={wrapRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      {size.w > 0 ? (
        <div
          className={cn("absolute top-0 overflow-hidden bg-white shadow-2xl ring-1 ring-black/10", rounded)}
          style={{
            width: dw,
            height: innerH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            left,
          }}
        >
          <SitePreview project={project} animated={animated} />
        </div>
      ) : null}
    </div>
  )
}
