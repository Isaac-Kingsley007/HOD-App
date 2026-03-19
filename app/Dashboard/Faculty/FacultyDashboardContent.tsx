'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// ============ Types ============

interface AdvisorSection {
  id: string
  name: string
  yearName: string
  currentSemester: string
  studentCount: number
}

interface StudentInfo {
  id: string
  slug: string
  name: string
  rollNo: string
}

interface Assignment {
  id: string
  subjectCode: string
  subjectName: string
  credits: number
  sectionId: string
  sectionName: string
  currentSemester: string
  students: StudentInfo[]
}

interface Announcement {
  id: string
  title: string
  content: string
  postedBy: string
  createdAt: string
}

interface FacultyData {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  qualification: string
  expertise: string
  image: string
  advisorSections: AdvisorSection[]
  assignments: Assignment[]
  announcements: Announcement[]
}

// ============ Sidebar ============

const sidebarItems = [
  { label: 'Overview', id: 'overview', icon: '📊' },
  { label: 'Profile', id: 'profile', icon: '👤' },
  { label: 'My Subjects', id: 'subjects', icon: '📚' },
  { label: 'Upload Marks', id: 'upload-marks', icon: '📝' },
  { label: 'Class Advisory', id: 'advisory', icon: '🎓' },
  { label: 'Announcements', id: 'announcements', icon: '📢' },
]

const Sidebar: React.FC<{ activeId: string; onNavigate: (id: string) => void; facultyName: string }> = ({
  activeId,
  onNavigate,
  facultyName,
}) => (
  <aside className="w-64 min-w-[16rem] bg-white dark:bg-slate-900 border-r dark:border-slate-800 p-4 flex flex-col">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Faculty Portal</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{facultyName}</p>
    </div>
    <nav className="space-y-1 flex-1">
      {sidebarItems.map((it) => (
        <div
          key={it.id}
          onClick={() => onNavigate(it.id)}
          role="button"
          tabIndex={0}
          className={`px-3 py-2.5 rounded-md cursor-pointer select-none text-sm transition-all flex items-center gap-2 ${
            activeId === it.id
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>{it.icon}</span>
          {it.label}
        </div>
      ))}
    </nav>
    <div className="pt-4 border-t dark:border-slate-800">
      <a href="/Dashboard/Faculty" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
        ← Switch Faculty
      </a>
    </div>
  </aside>
)

// ============ Header ============

const Header: React.FC<{ data: FacultyData }> = ({ data }) => (
  <header className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-900 text-white px-6 py-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={data.image} alt={data.name} className="w-14 h-14 rounded-full border-2 border-white/30" />
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <p className="text-sm text-emerald-100">
            {data.designation} • {data.email}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold">{data.assignments.length}</div>
        <div className="text-sm text-emerald-100">Subject Assignments</div>
      </div>
    </div>
  </header>
)

// ============ Stats Card ============

const StatsCard: React.FC<{ title: string; value: React.ReactNode }> = ({ title, value }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
    <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
)

// ============ Marks Upload ============

interface MarkEntry {
  studentId: string
  studentName: string
  rollNo: string
  internal1: string
  internal2: string
  internal3: string
  assignment: string
  exam: string
  total: string
  grade: string
}

const MarksUploadSection: React.FC<{ data: FacultyData }> = ({ data }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<string>('')
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<string | null>(null)

  const assignment = data.assignments.find((a) => a.id === selectedAssignment)

  const handleSelectAssignment = (assignmentId: string) => {
    setSelectedAssignment(assignmentId)
    setUploadResult(null)
    const asgn = data.assignments.find((a) => a.id === assignmentId)
    if (asgn) {
      setMarkEntries(
        asgn.students.map((s) => ({
          studentId: s.id,
          studentName: s.name,
          rollNo: s.rollNo,
          internal1: '',
          internal2: '',
          internal3: '',
          assignment: '',
          exam: '',
          total: '',
          grade: '',
        }))
      )
    }
  }

  const updateMark = (idx: number, field: keyof MarkEntry, value: string) => {
    const updated = [...markEntries]
    updated[idx] = { ...updated[idx], [field]: value }

    // Auto-calculate total
    const i1 = parseFloat(updated[idx].internal1) || 0
    const i2 = parseFloat(updated[idx].internal2) || 0
    const i3 = parseFloat(updated[idx].internal3) || 0
    const asgn = parseFloat(updated[idx].assignment) || 0
    const exam = parseFloat(updated[idx].exam) || 0
    const total = i1 + i2 + i3 + asgn + exam
    updated[idx].total = total > 0 ? total.toString() : ''

    // Auto-calculate grade
    if (total > 0) {
      const maxTotal = 100
      const pct = (total / maxTotal) * 100
      if (pct >= 90) updated[idx].grade = 'O'
      else if (pct >= 80) updated[idx].grade = 'A+'
      else if (pct >= 70) updated[idx].grade = 'A'
      else if (pct >= 60) updated[idx].grade = 'B+'
      else if (pct >= 50) updated[idx].grade = 'B'
      else if (pct >= 40) updated[idx].grade = 'C'
      else updated[idx].grade = 'F'
    }

    setMarkEntries(updated)
  }

  const handleUpload = async () => {
    if (!assignment) return
    setUploading(true)
    setUploadResult(null)

    try {
      const marksPayload = markEntries
        .filter((m) => m.internal1 || m.internal2 || m.internal3 || m.assignment || m.exam)
        .map((m) => ({
          studentId: m.studentId,
          internal1: m.internal1 ? parseFloat(m.internal1) : null,
          internal2: m.internal2 ? parseFloat(m.internal2) : null,
          internal3: m.internal3 ? parseFloat(m.internal3) : null,
          assignment: m.assignment ? parseFloat(m.assignment) : null,
          exam: m.exam ? parseFloat(m.exam) : null,
          total: m.total ? parseFloat(m.total) : null,
          grade: m.grade || null,
        }))

      const res = await fetch('/api/faculty/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyId: data.id,
          subjectCode: assignment.subjectCode,
          subjectName: assignment.subjectName,
          semester: assignment.currentSemester.replace(' Sem', ''),
          marks: marksPayload,
        }),
      })

      const result = await res.json()
      if (res.ok) {
        setUploadResult(`Successfully uploaded marks for ${result.count} students.`)
      } else {
        setUploadResult(`Error: ${result.error}`)
      }
    } catch (err) {
      setUploadResult('Failed to upload marks. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upload Marks</h2>

      {/* Subject Selector */}
      <div className="mb-4">
        <label className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Select Subject & Section</label>
        <select
          value={selectedAssignment}
          onChange={(e) => handleSelectAssignment(e.target.value)}
          className="w-full md:w-96 p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
        >
          <option value="">Choose a subject...</option>
          {data.assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.subjectCode} - {a.subjectName} ({a.sectionName})
            </option>
          ))}
        </select>
      </div>

      {/* Marks Table */}
      {assignment && markEntries.length > 0 && (
        <>
          <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="text-sm">
              <span className="font-medium">{assignment.subjectCode}</span> — {assignment.subjectName} |{' '}
              <span className="text-slate-500">{assignment.sectionName}</span> |{' '}
              <span className="text-slate-500">{assignment.currentSemester}</span> |{' '}
              <span className="text-slate-500">{assignment.students.length} students</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-slate-700 text-left">
                  <th className="py-2 px-2">Roll No</th>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2 text-center w-16">IA-1</th>
                  <th className="py-2 px-2 text-center w-16">IA-2</th>
                  <th className="py-2 px-2 text-center w-16">IA-3</th>
                  <th className="py-2 px-2 text-center w-16">Assign</th>
                  <th className="py-2 px-2 text-center w-16">Exam</th>
                  <th className="py-2 px-2 text-center w-16">Total</th>
                  <th className="py-2 px-2 text-center w-16">Grade</th>
                </tr>
              </thead>
              <tbody>
                {markEntries.map((m, idx) => (
                  <tr key={m.studentId} className="border-b dark:border-slate-800">
                    <td className="py-2 px-2 font-mono text-sm">{m.rollNo}</td>
                    <td className="py-2 px-2">{m.studentName}</td>
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="25"
                        value={m.internal1}
                        onChange={(e) => updateMark(idx, 'internal1', e.target.value)}
                        className="w-14 p-1 text-center border dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="25"
                        value={m.internal2}
                        onChange={(e) => updateMark(idx, 'internal2', e.target.value)}
                        className="w-14 p-1 text-center border dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="25"
                        value={m.internal3}
                        onChange={(e) => updateMark(idx, 'internal3', e.target.value)}
                        className="w-14 p-1 text-center border dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={m.assignment}
                        onChange={(e) => updateMark(idx, 'assignment', e.target.value)}
                        className="w-14 p-1 text-center border dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-1 px-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={m.exam}
                        onChange={(e) => updateMark(idx, 'exam', e.target.value)}
                        className="w-14 p-1 text-center border dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-2 px-2 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {m.total || '—'}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {m.grade ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            m.grade === 'F'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          }`}
                        >
                          {m.grade}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              {uploadResult && (
                <div
                  className={`text-sm px-3 py-2 rounded-md ${
                    uploadResult.startsWith('Successfully')
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  {uploadResult}
                </div>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 font-medium"
            >
              {uploading ? 'Uploading...' : 'Upload Marks'}
            </button>
          </div>
        </>
      )}

      {!selectedAssignment && (
        <div className="text-center py-12 text-slate-400">
          Select a subject above to begin uploading marks.
        </div>
      )}
    </div>
  )
}

// ============ Main Dashboard ============

export default function FacultyDashboardContent({ data }: { data: FacultyData }) {
  const [activeId, setActiveId] = useState('overview')
  const router = useRouter()

  const navigateTo = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Calculate unique sections taught
  const uniqueSections = new Set(data.assignments.map((a) => a.sectionId))
  const totalStudents = data.assignments.reduce(
    (acc, a) => acc + a.students.length,
    0
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex">
        <Sidebar activeId={activeId} onNavigate={navigateTo} facultyName={data.name} />

        <div className="flex-1 flex flex-col min-h-screen">
          <Header data={data} />

          <main className="p-6 space-y-6 flex-1">
            {/* Overview */}
            <section id="overview" className="scroll-mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Subjects Teaching" value={data.assignments.length} />
                <StatsCard title="Sections" value={uniqueSections.size} />
                <StatsCard title="Total Students" value={totalStudents} />
                <StatsCard title="Class Advisor" value={data.advisorSections.length > 0 ? 'Yes' : 'No'} />
              </div>

              {/* Workload Summary */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4 shadow-sm">
                  <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-3">Workload Allocation</h3>
                  <div className="space-y-2">
                    {data.assignments.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">{a.subjectCode}</span>
                          <span className="text-sm ml-2">{a.subjectName}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                          {a.credits} credits
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t dark:border-slate-800 text-sm text-slate-500">
                    Total Credits:{' '}
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {data.assignments.reduce((acc, a) => acc + a.credits, 0)}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4 shadow-sm">
                  <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigateTo('upload-marks')}
                      className="w-full text-left p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                      <div className="font-medium text-emerald-700 dark:text-emerald-300">Upload Marks</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Enter internal & exam marks for your subjects
                      </div>
                    </button>
                    <button
                      onClick={() => navigateTo('subjects')}
                      className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      <div className="font-medium text-blue-700 dark:text-blue-300">View Subjects</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                        See all assigned subjects and student lists
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile */}
            <section id="profile" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Faculty Profile</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <img src={data.image} alt={data.name} className="w-24 h-24 rounded-full border-2 border-slate-200" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                    <ProfileField label="Full Name" value={data.name} />
                    <ProfileField label="Designation" value={data.designation} />
                    <ProfileField label="Email" value={data.email} />
                    <ProfileField label="Phone" value={data.phone || '—'} />
                    <ProfileField label="Qualification" value={data.qualification || '—'} />
                    <ProfileField label="Expertise" value={data.expertise || '—'} />
                  </div>
                </div>
              </div>
            </section>

            {/* My Subjects */}
            <section id="subjects" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">My Subjects & Students</h2>
                <div className="space-y-4">
                  {data.assignments.map((a) => (
                    <div key={a.id} className="border dark:border-slate-800 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
                        <div>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                            {a.subjectCode}
                          </span>
                          <span className="ml-2 font-medium">{a.subjectName}</span>
                          <span className="ml-2 text-sm text-slate-500">({a.credits} credits)</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          {a.sectionName} • {a.currentSemester} • {a.students.length} students
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                          {a.students.map((s) => (
                            <div
                              key={s.id}
                              className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm flex items-center gap-2"
                            >
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.slug}`}
                                alt={s.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-xs">{s.name}</div>
                                <div className="text-xs text-slate-500">{s.rollNo}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Upload Marks */}
            <section id="upload-marks" className="scroll-mt-4">
              <MarksUploadSection data={data} />
            </section>

            {/* Class Advisory */}
            <section id="advisory" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Class Advisory</h2>
                {data.advisorSections.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {data.advisorSections.map((s) => (
                      <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                        <div className="font-medium text-lg">{s.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.yearName}</div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-slate-600 dark:text-slate-300">{s.currentSemester}</span>
                          <span className="text-sm font-medium">{s.studentCount} students</span>
                        </div>
                        <button
                          onClick={() => router.push(`/Dashboard/Admin/section/${s.id}`)}
                          className="mt-3 w-full text-center py-1.5 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                        >
                          View Section
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    You are not currently assigned as a class advisor.
                  </div>
                )}
              </div>
            </section>

            {/* Announcements */}
            <section id="announcements" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Announcements</h2>
                {data.announcements.length > 0 ? (
                  <div className="space-y-3">
                    {data.announcements.map((a) => (
                      <div key={a.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{a.title}</div>
                          <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{a.content}</p>
                        <div className="text-xs text-slate-400 mt-2">Posted by: {a.postedBy}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">No announcements at this time.</div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

// ============ Helper ============

const ProfileField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</div>
    <div className="text-sm mt-0.5">{value}</div>
  </div>
)
