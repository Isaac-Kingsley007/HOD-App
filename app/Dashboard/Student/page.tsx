import React from 'react'
import { getAllStudents, getStudentDashboardData } from '@/lib/queries'
import StudentDashboardContent from './StudentDashboardContent'
import StudentSelector from './StudentSelector'

export default async function StudentPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) {
    const students = await getAllStudents()
    return <StudentSelector students={students} />
  }

  const data = await getStudentDashboardData(id)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Not Found</h1>
          <p className="text-slate-500 mt-2">The student ID &ldquo;{id}&rdquo; was not found.</p>
          <a href="/Dashboard/Student" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md">
            Back to Selection
          </a>
        </div>
      </div>
    )
  }

  return <StudentDashboardContent data={data} />
}