"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Classroom } from "@/components/classroom"
import { ALL_COURSES } from "@/lib/seed"

const LABELS: Record<string, string> = {
  startup: "Vállalkozás",
  ai: "Mesterséges intelligencia",
  office: "Irodai készségek",
}

export default function ClassroomPage({
  params,
}: {
  params: Promise<{ category: string; courseId: string }>
}) {
  const { category, courseId } = use(params)
  const course = ALL_COURSES.find((c) => c.id === courseId && c.type === category)
  if (!course) return notFound()

  return (
    <Classroom
      course={course}
      backHref={`/app/education/${category}`}
      backLabel={`Vissza: ${LABELS[category] ?? "Edukáció"}`}
    />
  )
}
