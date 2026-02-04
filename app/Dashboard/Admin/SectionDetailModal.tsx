"use client"

import React, { useEffect, useState } from 'react'

type Student = { id: string; name: string; rollNo: string; year: string; section: string }
type FacultyAssignment = { facultyId: string; facultyName: string; subjectCode: string; subjectName: string }

export const SectionDetailModal: React.FC<{ sectionId: string; onClose: () => void }> = ({ sectionId, onClose }) => {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([])

  useEffect(() => {
    if (!sectionId) return
    setLoading(true)
    fetch(`/api/sections/${sectionId}`)
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students || [])
        setAssignments(data.assignments || [])
      })
      .catch(() => {
        setStudents([])
        setAssignments([])
      })
      .finally(() => setLoading(false))
  }, [sectionId])

  if (!sectionId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded shadow-lg p-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Section Details — {sectionId}</h3>
          <button onClick={onClose} className="text-sm text-slate-600 dark:text-slate-300">Close</button>
        </div>

        {loading ? (
          <div className="mt-4">Loading…</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Students ({students.length})</div>
              <ul className="mt-2 divide-y dark:divide-slate-800">
                {students.map((s) => (
                  <li key={s.id} className="py-2 text-sm">
                    <div className="font-medium">{s.rollNo} — {s.name}</div>
                    <div className="text-slate-500 text-xs">{s.year} • {s.section}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm text-slate-500">Faculty Assignments</div>
              <ul className="mt-2 divide-y dark:divide-slate-800">
                {assignments.map((a) => (
                  <li key={a.facultyId + a.subjectCode} className="py-2 text-sm">
                    <div className="font-medium">{a.facultyName}</div>
                    <div className="text-slate-500 text-xs">{a.subjectName} • {a.subjectCode}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div onClick={onClose} className="fixed inset-0 bg-black/30" />
    </div>
  )
}

export default SectionDetailModal
