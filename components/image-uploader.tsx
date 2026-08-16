"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value?: string | null
  onUploaded: (url: string) => void
  onRemove?: () => void
  folder?: string
  label?: string
  hint?: string
  aspect?: "square" | "wide" | "logo"
  className?: string
}

export function ImageUploader({
  value,
  onUploaded,
  onRemove,
  folder = "uploads",
  label = "Kép feltöltése",
  hint = "PNG, JPG, WEBP – max. 5 MB",
  aspect = "wide",
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const upload = useCallback(
    async (file: File) => {
      setError(null)
      setUploading(true)
      try {
        const fd = new FormData()
        fd.append("file", file)
        fd.append("folder", folder)
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "A feltöltés nem sikerült.")
        onUploaded(data.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ismeretlen hiba.")
      } finally {
        setUploading(false)
      }
    },
    [folder, onUploaded],
  )

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) void upload(file)
  }

  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "logo" ? "aspect-[3/1]" : "aspect-[16/9]"

  return (
    <div className={cn("w-full", className)}>
      {label ? <p className="mb-2 text-sm font-medium text-foreground">{label}</p> : null}

      {value ? (
        <div className={cn("group relative overflow-hidden rounded-xl border border-border bg-muted", aspectClass)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value || "/placeholder.svg"} alt="Feltöltött kép" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
            >
              Csere
            </button>
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:opacity-90"
              >
                Törlés
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 text-center transition-colors",
            aspectClass,
            dragging ? "border-primary bg-primary/5" : "border-border bg-muted/40 hover:border-primary/60 hover:bg-muted",
          )}
        >
          {uploading ? (
            <>
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Feltöltés folyamatban…</span>
            </>
          ) : (
            <>
              <svg className="h-7 w-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
              </svg>
              <span className="text-sm font-medium text-foreground">Kattintson vagy húzza ide a képet</span>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </>
          )}
        </button>
      )}

      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
