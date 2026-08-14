"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Classroom } from "@/components/classroom"
import { ALL_COURSES } from "@/lib/seed"

export default function EducationCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const course = ALL_COURSES.find((c) => c.id === courseId)
  if (!course) return notFound()
  return <Classroom course={course} backHref="/app/education" backLabel="Vissza az Edukációhoz" />
}
