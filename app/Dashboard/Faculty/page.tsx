import React from 'react'
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getFacultyDashboardData } from '@/lib/queries'
import FacultyDashboardContent from './FacultyDashboardContent'

export default async function FacultyPage() {
  const session = await auth()

  if (!session || session.user.role !== "faculty") {
    redirect("/Login/faculty")
  }

  const facultyId = session.user.facultyId

  if (!facultyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Profile Not Linked</h1>
          <p className="text-gray-600 mt-2">
            Your account is not linked to a faculty profile. Please contact the admin.
          </p>
        </div>
      </div>
    )
  }

  const data = await getFacultyDashboardData(facultyId)

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Faculty Profile Not Found</h1>
      </div>
    )
  }

  return <FacultyDashboardContent data={data} />
}
