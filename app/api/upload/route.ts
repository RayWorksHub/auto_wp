import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Nem érkezett fájl." }, { status: 400 })
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Csak kép tölthető fel (PNG, JPG, WEBP, GIF, SVG)." },
        { status: 415 },
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "A fájl túl nagy (max. 5 MB)." }, { status: 413 })
    }

    const folder = (form.get("folder") as string | null)?.replace(/[^a-z0-9-]/gi, "") || "uploads"
    const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "_")
    const key = `${folder}/${Date.now()}-${safeName}`

    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url, pathname: blob.pathname })
  } catch (err) {
    console.log("[v0] Blob upload error:", err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: "A feltöltés nem sikerült." }, { status: 500 })
  }
}
