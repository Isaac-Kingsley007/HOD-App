import React from 'react'
import { getAllFaculty, getFacultyDashboardData } from '@/lib/queries'
import FacultyDashboardContent from './FacultyDashboardContent'
import FacultySelector from './FacultySelector'

export default async function FacultyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) {
    const faculty = await getAllFaculty()
    return <FacultySelector faculty={faculty} />
  }

  const data = await getFacultyDashboardData(id)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Faculty Not Found</h1>
          <p className="text-slate-500 mt-2">The faculty ID was not found.</p>
          <a href="/Dashboard/Faculty" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md">
            Back to Selection
          </a>
        </div>
      </div>
    )
  }

  return <FacultyDashboardContent data={data} />
}