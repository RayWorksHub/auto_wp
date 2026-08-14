import type { Course, CourseResource } from "./types"

/* Wrap a long string into lines that fit a rough character width. */
function wrap(text: string, max = 92): string[] {
  if (!text) return [""]
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ""
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      if (line) lines.push(line)
      line = w
    } else {
      line = (line + " " + w).trim()
    }
  }
  if (line) lines.push(line)
  return lines
}

function pdfEscape(s: string): string {
  // Replace characters PDF's WinAnsi Helvetica can't render, then escape syntax chars.
  return s
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/–|—/g, "-")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
}

/**
 * Build a minimal, valid single-page A4 PDF from a title + body lines.
 * No external dependencies — assembles objects and xref offsets by hand.
 */
export function buildTextPdf(title: string, body: string[]): Blob {
  const leading = 16
  const top = 792
  const left = 56

  // Compose the content stream instructions.
  let stream = "BT\n"
  stream += `/F2 20 Tf\n${left} ${top} Td\n(${pdfEscape(title)}) Tj\n`
  stream += `/F1 11 Tf\n0 -34 Td\n`

  const allLines: string[] = []
  for (const raw of body) {
    if (raw === "") {
      allLines.push("")
      continue
    }
    // Bullet / heading passthrough with wrapping.
    for (const l of wrap(raw)) allLines.push(l)
  }

  allLines.forEach((l, i) => {
    if (i > 0) stream += `0 -${leading} Td\n`
    stream += `(${pdfEscape(l)}) Tj\n`
  })
  stream += "ET"

  const objects: string[] = []
  objects.push("<< /Type /Catalog /Pages 2 0 R >>")
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
  objects.push(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
  )
  objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

  let pdf = "%PDF-1.4\n"
  const offsets: number[] = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += "0000000000 65535 f \n"
  offsets.forEach((off) => {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return new Blob([pdf], { type: "application/pdf" })
}

function buildCsv(lines: string[]): Blob {
  // Prepend a BOM so Excel opens UTF-8 (accented Hungarian text) correctly.
  return new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" })
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export function downloadResource(course: Course) {
  const res: CourseResource = course.resource ?? {
    filename: `${course.id}-segedanyag.pdf`,
    kind: "pdf",
    lines: [course.title, "", course.description],
  }
  if (res.kind === "csv") {
    triggerDownload(buildCsv(res.lines), res.filename)
  } else {
    triggerDownload(buildTextPdf(course.title, res.lines), res.filename)
  }
}
