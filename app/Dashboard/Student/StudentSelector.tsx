'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface StudentOption {
  slug: string
  name: string
  rollNo: string
  sectionName: string
  yearName: string
}

export default function StudentSelector({ students }: { students: StudentOption[] }) {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Student Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select your profile to access the dashboard</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 shadow-sm p-6">
          <input
            type="text"
            placeholder="Search by name, roll number, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 mb-6 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((s) => (
              <button
                key={s.slug}
                onClick={() => router.push(`/Dashboard/Student?id=${s.slug}`)}
                className="text-left p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700 hover:border-indigo-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.slug}`}
                    alt={s.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white group-hover:text-indigo-600">{s.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{s.rollNo}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {s.sectionName} • {s.yearName}
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No students found matching your search.</div>
          )}
        </div>
      </main>
    </div>
  )
}
