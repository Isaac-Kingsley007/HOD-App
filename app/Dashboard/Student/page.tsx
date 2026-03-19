import React from 'react'
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getStudentDashboardData } from '@/lib/queries'
import { prisma } from "@/lib/db"
import StudentDashboardContent from './StudentDashboardContent'

export default async function StudentPage() {
  const session = await auth()

  if (!session || session.user.role !== "student") {
    redirect("/Login/student")
  }

  const studentId = session.user.studentId

  if (!studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Profile Not Linked</h1>
          <p className="text-gray-600 mt-2">
            Your account is not linked to a student profile. Please contact the admin.
          </p>
        </div>
      </div>
    )
  }

  // Get student slug from studentId
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { slug: true },
  })

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Student Profile Not Found</h1>
      </div>
    )
  }

  const data = await getStudentDashboardData(student.slug)

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Student Data Not Found</h1>
      </div>
    )
  }

  return <StudentDashboardContent data={data} />
}
