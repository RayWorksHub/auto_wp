"use client"

import { useEffect, useRef, useState } from "react"
import { Icon } from "@/components/icons"
import type { Lesson } from "@/lib/types"

/**
 * Lightweight YouTube facade: shows the real video thumbnail with a play button,
 * then swaps to the embedded player on click. Falls back to a branded panel with
 * a "watch on YouTube" link if the thumbnail (or embedding) is unavailable — so a
 * lesson is never a black empty box.
 *
 * While playing, it talks to the YouTube IFrame API over postMessage so it can
 * fire `onEnded` once the viewer finishes the video — the classroom uses that to
 * mark the lesson complete automatically.
 */
export function LessonVideo({
  lesson,
  color,
  onEnded,
}: {
  lesson: Lesson
  color: string
  onEnded?: () => void
}) {
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Reset when the lesson changes.
  useEffect(() => {
    setPlaying(false)
    setThumbFailed(false)
  }, [lesson.id])

  const id = lesson.youtubeId

  // Listen for the YouTube player reaching the "ended" state (playerState === 0).
  useEffect(() => {
    if (!playing || !id) return
    const iframe = iframeRef.current

    const handshake = () =>
      iframe?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: lesson.id, channel: "widget" }),
        "*",
      )
    const timer = setInterval(handshake, 1000)
    handshake()

    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== "string" || !e.data.includes("youtube")) {
        // Some browsers deliver already-parsed objects; guard both shapes below.
      }
      let data: unknown = e.data
      if (typeof data === "string") {
        try {
          data = JSON.parse(data)
        } catch {
          return
        }
      }
      const msg = data as { event?: string; info?: unknown }
      const ended =
        (msg.event === "onStateChange" && msg.info === 0) ||
        (msg.event === "infoDelivery" &&
          typeof msg.info === "object" &&
          msg.info !== null &&
          (msg.info as { playerState?: number }).playerState === 0)
      if (ended) onEnded?.()
    }

    window.addEventListener("message", onMessage)
    return () => {
      clearInterval(timer)
      window.removeEventListener("message", onMessage)
    }
  }, [playing, id, lesson.id, onEnded])

  const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null

  if (playing && id) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <iframe
          key={lesson.id}
          ref={iframeRef}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1&modestbranding=1&enablejsapi=1`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  const showThumb = thumb && !thumbFailed

  return (
    <button
      type="button"
      onClick={() => (id ? setPlaying(true) : window.open(lesson.youtubeUrl, "_blank", "noopener"))}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-lg"
      aria-label={`Videó lejátszása: ${lesson.title}`}
    >
      {showThumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb || "/placeholder.svg"}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setThumbFailed(true)}
        />
      ) : (
        <div
          className="h-full w-full"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}22)` }}
        />
      )}

      {/* Darkening + play button */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-xl transition-transform group-hover:scale-110">
          <Icon.play width={26} height={26} />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 text-left">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white">{lesson.title}</span>
          <span className="block text-xs text-white/80">{lesson.duration} · YouTube</span>
        </span>
        <span className="hidden shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur sm:block">
          Lejátszás
        </span>
      </span>
    </button>
  )
}
