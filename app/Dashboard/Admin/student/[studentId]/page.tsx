import React from 'react'
import { notFound } from 'next/navigation'
import { getStudentProfile } from '@/lib/queries'

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const profile = await getStudentProfile(studentId)
  if (!profile) return notFound()

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-6 mb-6">
          <img src={profile.image} alt={profile.name} className="w-28 h-28 rounded-full border" />
          <div>
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <div className="text-sm text-slate-500">Roll No: {profile.rollNo} • Reg No: {profile.regNo}</div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{profile.email} • {profile.phone}</div>
            <div className="text-sm text-slate-500 mt-1">{profile.address}</div>
          </div>
          <div className="ml-auto text-center">
            <div className="text-3xl font-bold">{profile.attendancePercent}%</div>
            <div className="text-sm text-slate-500">Attendance</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800">
            <h3 className="font-semibold mb-2">Marks by Semester</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-slate-800">
                  <th className="py-2 text-left">Semester</th>
                  <th className="py-2 text-left">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {profile.marks.map((m) => (
                  <tr key={m.semester} className="border-b dark:border-slate-800">
                    <td className="py-2">{m.semester}</td>
                    <td className="py-2">{m.percentage ?? m.gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800">
            <h3 className="font-semibold mb-2">Certifications</h3>
            <ul className="space-y-2 text-sm">
              {profile.certifications.map((c, i) => (
                <li key={i} className="p-2 bg-slate-50 dark:bg-slate-800 rounded">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-slate-500">{c.issuer} — {c.date}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800">
          <h3 className="font-semibold mb-2">Projects</h3>
          <div className="space-y-3">
            {profile.projects.map((p, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="font-medium">{p.title} <span className="text-xs text-slate-500">({p.year})</span></div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
