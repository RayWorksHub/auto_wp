"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Classroom } from "@/components/classroom"
import { OFFICE_TRACKS } from "@/lib/seed"

export default function OfficeCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const track = OFFICE_TRACKS.find((c) => c.id === courseId)
  if (!track) return notFound()
  return <Classroom course={track} backHref="/app/office" backLabel="Vissza az Irodai készségekhez" />
}
