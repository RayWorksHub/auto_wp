/**
 * Extract a primary + accent color from an image (e.g. an uploaded logo).
 * Runs entirely client-side on a <canvas>. Buckets pixels by coarse hue,
 * ignores near-white / near-black / low-saturation pixels, and returns the
 * two most prominent vivid colors as hex.
 */

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

export async function extractPalette(src: string): Promise<{ primary: string; accent: string } | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        const size = 60
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) return resolve(null)
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)

        // Bucket by 30° hue segments, tracking count + summed rgb + saturation.
        const buckets = new Map<number, { count: number; r: number; g: number; b: number; satSum: number }>()

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          if (a < 128) continue
          const [h, s, l] = rgbToHsl(r, g, b)
          if (l > 0.92 || l < 0.08) continue // skip near white/black
          if (s < 0.18) continue // skip greys
          const key = Math.round(h / 30) * 30
          const cur = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0, satSum: 0 }
          cur.count += 1
          cur.r += r
          cur.g += g
          cur.b += b
          cur.satSum += s
          buckets.set(key, cur)
        }

        if (buckets.size === 0) return resolve(null)

        // Score buckets by count weighted by saturation for vividness.
        const ranked = [...buckets.values()]
          .map((bck) => ({
            hex: rgbToHex(bck.r / bck.count, bck.g / bck.count, bck.b / bck.count),
            score: bck.count * (bck.satSum / bck.count),
            hue: 0,
          }))
          .sort((a, b) => b.score - a.score)

        const primary = ranked[0].hex
        const accent = ranked[1]?.hex ?? ranked[0].hex
        resolve({ primary, accent })
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}
