"use client"

import { useEffect, useState } from "react"
import { Icon } from "@/components/icons"
import type { Lesson } from "@/lib/types"

/**
 * Lightweight YouTube facade: shows the real video thumbnail with a play button,
 * then swaps to the embedded player on click. Falls back to a branded panel with
 * a "watch on YouTube" link if the thumbnail (or embedding) is unavailable — so a
 * lesson is never a black empty box.
 */
export function LessonVideo({ lesson, color }: { lesson: Lesson; color: string }) {
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)

  // Reset when the lesson changes.
  useEffect(() => {
    setPlaying(false)
    setThumbFailed(false)
  }, [lesson.id])

  const id = lesson.youtubeId
  const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null

  if (playing && id) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <iframe
          key={lesson.id}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1&modestbranding=1`}
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
