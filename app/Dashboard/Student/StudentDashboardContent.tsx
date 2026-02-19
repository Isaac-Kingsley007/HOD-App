'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// ============ Types ============

interface Certification {
  id: string
  title: string
  issuer: string
  date: string
}

interface Project {
  id: string
  title: string
  description: string
  year: string
}

interface SubjectMarkData {
  id: string
  subjectCode: string
  subjectName: string
  semester: string
  internal1: number | null
  internal2: number | null
  internal3: number | null
  assignment: number | null
  exam: number | null
  total: number | null
  grade: string | null
}

interface Announcement {
  id: string
  title: string
  content: string
  postedBy: string
  createdAt: string
}

interface StudentData {
  id: string
  name: string
  rollNo: string
  regNo: string
  email: string
  phone: string
  address: string
  image: string
  dob: string
  bloodGroup: string
  parentName: string
  parentPhone: string
  achievements: string
  sectionName: string
  yearName: string
  currentSemester: string
  marks: { semester: string; gpa?: number; percentage?: number }[]
  subjectMarks: SubjectMarkData[]
  certifications: Certification[]
  projects: Project[]
  attendance: { semester: string; percent: number }[]
  subjects: { code: string; name: string; credits: number; facultyName: string }[]
  announcements: Announcement[]
}

// ============ Sidebar ============

const sidebarItems = [
  { label: 'Overview', id: 'overview', icon: '📊' },
  { label: 'Profile', id: 'profile', icon: '👤' },
  { label: 'Marks & Performance', id: 'marks', icon: '📝' },
  { label: 'Attendance', id: 'attendance', icon: '📅' },
  { label: 'Certifications', id: 'certifications', icon: '🏆' },
  { label: 'Projects', id: 'projects', icon: '💻' },
  { label: 'Subjects', id: 'subjects', icon: '📚' },
  { label: 'Announcements', id: 'announcements', icon: '📢' },
]

const Sidebar: React.FC<{ activeId: string; onNavigate: (id: string) => void; studentName: string }> = ({
  activeId,
  onNavigate,
  studentName,
}) => (
  <aside className="w-64 min-w-[16rem] bg-white dark:bg-slate-900 border-r dark:border-slate-800 p-4 flex flex-col">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Student Portal</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{studentName}</p>
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
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>{it.icon}</span>
          {it.label}
        </div>
      ))}
    </nav>
    <div className="pt-4 border-t dark:border-slate-800">
      <a href="/Dashboard/Student" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
        ← Switch Student
      </a>
    </div>
  </aside>
)

// ============ Header ============

const Header: React.FC<{ data: StudentData; onEditProfile: () => void }> = ({ data, onEditProfile }) => (
  <header className="bg-gradient-to-r from-indigo-600 to-blue-700 dark:from-indigo-900 dark:to-blue-900 text-white px-6 py-5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={data.image} alt={data.name} className="w-14 h-14 rounded-full border-2 border-white/30" />
        <div>
          <h1 className="text-2xl font-semibold">{data.name}</h1>
          <p className="text-sm text-indigo-100">
            {data.rollNo} • {data.sectionName} • {data.yearName} • {data.currentSemester}
          </p>
        </div>
      </div>
      <button
        onClick={onEditProfile}
        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
      >
        Edit Profile
      </button>
    </div>
  </header>
)

// ============ Stats Cards ============

const StatsCard: React.FC<{ title: string; value: React.ReactNode; color?: string }> = ({
  title,
  value,
  color = 'bg-white dark:bg-slate-900',
}) => (
  <div className={`${color} p-4 rounded-lg border dark:border-slate-800 shadow-sm`}>
    <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
)

// ============ Profile Edit Modal ============

const ProfileEditModal: React.FC<{
  data: StudentData
  onClose: () => void
  onSave: (updated: Partial<StudentData>) => void
  saving: boolean
}> = ({ data, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    name: data.name,
    phone: data.phone,
    address: data.address,
    imageUrl: data.image,
    dob: data.dob,
    bloodGroup: data.bloodGroup,
    parentName: data.parentName,
    parentPhone: data.parentPhone,
    achievements: data.achievements,
  })

  const [certifications, setCertifications] = useState<Certification[]>(data.certifications)
  const [projects, setProjects] = useState<Project[]>(data.projects)

  const addCert = () =>
    setCertifications([...certifications, { id: `new-${Date.now()}`, title: '', issuer: '', date: '' }])
  const removeCert = (i: number) => setCertifications(certifications.filter((_, idx) => idx !== i))

  const addProject = () =>
    setProjects([...projects, { id: `new-${Date.now()}`, title: '', description: '', year: '' }])
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i))

  const handleSubmit = () => {
    onSave({
      ...form,
      image: form.imageUrl,
      certifications: certifications.filter((c) => c.title.trim()),
      projects: projects.filter((p) => p.title.trim()),
    } as Partial<StudentData>)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 bg-black/50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-3xl mx-4 my-8 border dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-800">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Profile Image URL */}
          <div>
            <h3 className="font-medium mb-3 text-sm text-slate-500 uppercase tracking-wide">Profile Image</h3>
            <div className="flex items-center gap-4">
              <img src={form.imageUrl} alt="Preview" className="w-16 h-16 rounded-full border" />
              <input
                type="text"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="flex-1 p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <h3 className="font-medium mb-3 text-sm text-slate-500 uppercase tracking-wide">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-slate-600 dark:text-slate-300">Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Parent Name</label>
                <input
                  value={form.parentName}
                  onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">Parent Phone</label>
                <input
                  value={form.parentPhone}
                  onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                  className="w-full p-2 mt-1 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="font-medium mb-3 text-sm text-slate-500 uppercase tracking-wide">Achievements</h3>
            <textarea
              value={form.achievements}
              onChange={(e) => setForm({ ...form, achievements: e.target.value })}
              rows={3}
              placeholder="List your achievements, awards, extracurricular activities..."
              className="w-full p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
            />
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm text-slate-500 uppercase tracking-wide">Certifications</h3>
              <button onClick={addCert} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md">
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {certifications.map((c, i) => (
                <div key={c.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                  <input
                    placeholder="Certificate Title"
                    value={c.title}
                    onChange={(e) => {
                      const updated = [...certifications]
                      updated[i] = { ...updated[i], title: e.target.value }
                      setCertifications(updated)
                    }}
                    className="p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  />
                  <input
                    placeholder="Issuer"
                    value={c.issuer}
                    onChange={(e) => {
                      const updated = [...certifications]
                      updated[i] = { ...updated[i], issuer: e.target.value }
                      setCertifications(updated)
                    }}
                    className="p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  />
                  <input
                    type="date"
                    value={c.date}
                    onChange={(e) => {
                      const updated = [...certifications]
                      updated[i] = { ...updated[i], date: e.target.value }
                      setCertifications(updated)
                    }}
                    className="p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  />
                  <button onClick={() => removeCert(i)} className="text-red-500 hover:text-red-700 text-lg px-2">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm text-slate-500 uppercase tracking-wide">Projects</h3>
              <button onClick={addProject} className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md">
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {projects.map((p, i) => (
                <div key={p.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                  <input
                    placeholder="Project Title"
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...projects]
                      updated[i] = { ...updated[i], title: e.target.value }
                      setProjects(updated)
                    }}
                    className="p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  />
                  <input
                    placeholder="Description"
                    value={p.description}
                    onChange={(e) => {
                      const updated = [...projects]
                      updated[i] = { ...updated[i], description: e.target.value }
                      setProjects(updated)
                    }}
                    className="p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                  />
                  <input
                    placeholder="Year"
                    value={p.year}
                    onChange={(e) => {
                      const updated = [...projects]
                      updated[i] = { ...updated[i], year: e.target.value }
                      setProjects(updated)
                    }}
                    className="p-2 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 w-20"
                  />
                  <button onClick={() => removeProject(i)} className="text-red-500 hover:text-red-700 text-lg px-2">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t dark:border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ Main Dashboard ============

export default function StudentDashboardContent({ data: initialData }: { data: StudentData }) {
  const [data, setData] = useState(initialData)
  const [activeId, setActiveId] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const navigateTo = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSaveProfile = async (updated: Partial<StudentData>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/students/${data.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updated.name,
          phone: updated.phone,
          address: updated.address,
          imageUrl: updated.image,
          dob: (updated as Record<string, string>).dob || undefined,
          bloodGroup: (updated as Record<string, string>).bloodGroup || undefined,
          parentName: (updated as Record<string, string>).parentName || undefined,
          parentPhone: (updated as Record<string, string>).parentPhone || undefined,
          achievements: updated.achievements || undefined,
          certifications: updated.certifications,
          projects: updated.projects,
        }),
      })

      if (res.ok) {
        setShowEditModal(false)
        router.refresh()
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  // Compute latest stats
  const latestAttendance = data.attendance.length > 0 ? data.attendance[data.attendance.length - 1] : null
  const latestMarks = data.marks.length > 0 ? data.marks[data.marks.length - 1] : null
  const overallGPA =
    data.marks.length > 0
      ? (data.marks.reduce((acc, m) => acc + (m.gpa ?? m.percentage ?? 0), 0) / data.marks.length).toFixed(2)
      : 'N/A'

  // Group subject marks by semester
  const subjectMarksBySemester = data.subjectMarks.reduce(
    (acc, sm) => {
      if (!acc[sm.semester]) acc[sm.semester] = []
      acc[sm.semester].push(sm)
      return acc
    },
    {} as Record<string, SubjectMarkData[]>
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex">
        <Sidebar activeId={activeId} onNavigate={navigateTo} studentName={data.name} />

        <div className="flex-1 flex flex-col min-h-screen">
          <Header data={data} onEditProfile={() => setShowEditModal(true)} />

          <main className="p-6 space-y-6 flex-1">
            {/* Overview */}
            <section id="overview" className="scroll-mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Current Semester" value={data.currentSemester} />
                <StatsCard
                  title="Attendance"
                  value={latestAttendance ? `${latestAttendance.percent}%` : 'N/A'}
                />
                <StatsCard
                  title="Latest Marks"
                  value={latestMarks ? `${latestMarks.percentage ?? latestMarks.gpa ?? 'N/A'}%` : 'N/A'}
                />
                <StatsCard title="CGPA / Avg" value={overallGPA} />
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4 shadow-sm">
                  <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-2">Section & Year</h3>
                  <div className="text-lg font-semibold">{data.sectionName}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">{data.yearName}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4 shadow-sm">
                  <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-2">Certifications</h3>
                  <div className="text-lg font-semibold">{data.certifications.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Earned</div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-4 shadow-sm">
                  <h3 className="text-sm text-slate-500 dark:text-slate-400 mb-2">Projects</h3>
                  <div className="text-lg font-semibold">{data.projects.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Completed</div>
                </div>
              </div>
            </section>

            {/* Profile */}
            <section id="profile" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <img src={data.image} alt={data.name} className="w-24 h-24 rounded-full border-2 border-slate-200" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                    <ProfileField label="Full Name" value={data.name} />
                    <ProfileField label="Roll Number" value={data.rollNo} />
                    <ProfileField label="Register Number" value={data.regNo} />
                    <ProfileField label="Email" value={data.email} />
                    <ProfileField label="Phone" value={data.phone || '—'} />
                    <ProfileField label="Date of Birth" value={data.dob || '—'} />
                    <ProfileField label="Blood Group" value={data.bloodGroup || '—'} />
                    <ProfileField label="Parent Name" value={data.parentName || '—'} />
                    <ProfileField label="Parent Phone" value={data.parentPhone || '—'} />
                    <div className="sm:col-span-2 md:col-span-3">
                      <ProfileField label="Address" value={data.address || '—'} />
                    </div>
                  </div>
                </div>
                {data.achievements && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Achievements</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-200 whitespace-pre-wrap">{data.achievements}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Marks & Performance */}
            <section id="marks" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>

                {/* Semester-wise GPA/Percentage */}
                {data.marks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-3">Semester-wise Performance</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {data.marks.map((m) => (
                        <div key={m.semester} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Sem {m.semester}</div>
                          <div className="text-xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">
                            {m.percentage !== undefined ? `${m.percentage}%` : m.gpa?.toFixed(2) ?? '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject-wise marks */}
                {Object.keys(subjectMarksBySemester).length > 0 ? (
                  Object.entries(subjectMarksBySemester).map(([semester, marks]) => (
                    <div key={semester} className="mb-6">
                      <h3 className="text-sm font-medium text-slate-500 mb-3">
                        Semester {semester} — Subject Marks
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b dark:border-slate-700">
                              <th className="text-left py-2 px-2">Code</th>
                              <th className="text-left py-2 px-2">Subject</th>
                              <th className="text-center py-2 px-2">IA-1</th>
                              <th className="text-center py-2 px-2">IA-2</th>
                              <th className="text-center py-2 px-2">IA-3</th>
                              <th className="text-center py-2 px-2">Assign</th>
                              <th className="text-center py-2 px-2">Exam</th>
                              <th className="text-center py-2 px-2">Total</th>
                              <th className="text-center py-2 px-2">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {marks.map((sm) => (
                              <tr key={sm.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="py-2 px-2 font-mono text-indigo-600 dark:text-indigo-400">{sm.subjectCode}</td>
                                <td className="py-2 px-2">{sm.subjectName}</td>
                                <td className="py-2 px-2 text-center">{sm.internal1 ?? '—'}</td>
                                <td className="py-2 px-2 text-center">{sm.internal2 ?? '—'}</td>
                                <td className="py-2 px-2 text-center">{sm.internal3 ?? '—'}</td>
                                <td className="py-2 px-2 text-center">{sm.assignment ?? '—'}</td>
                                <td className="py-2 px-2 text-center">{sm.exam ?? '—'}</td>
                                <td className="py-2 px-2 text-center font-semibold">{sm.total ?? '—'}</td>
                                <td className="py-2 px-2 text-center">
                                  {sm.grade ? (
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                      {sm.grade}
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
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No subject marks uploaded yet. Marks will appear here once faculty uploads them.
                  </div>
                )}
              </div>
            </section>

            {/* Attendance */}
            <section id="attendance" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Attendance</h2>
                {data.attendance.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {data.attendance.map((a) => {
                      const color =
                        a.percent >= 85
                          ? 'text-green-600 dark:text-green-400'
                          : a.percent >= 75
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      return (
                        <div key={a.semester} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Sem {a.semester}</div>
                          <div className={`text-2xl font-bold mt-1 ${color}`}>{a.percent}%</div>
                          <div className="mt-1">
                            {a.percent < 75 && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                                Defaulter
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">No attendance data available.</div>
                )}
              </div>
            </section>

            {/* Certifications */}
            <section id="certifications" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Certifications</h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add Certification
                  </button>
                </div>
                {data.certifications.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {data.certifications.map((c) => (
                      <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                        <div className="font-medium">{c.title}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.issuer}</div>
                        <div className="text-xs text-slate-400 mt-2">{c.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No certifications added yet. Click &ldquo;Edit Profile&rdquo; to add your certifications.
                  </div>
                )}
              </div>
            </section>

            {/* Projects */}
            <section id="projects" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add Project
                  </button>
                </div>
                {data.projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.projects.map((p) => (
                      <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{p.title}</div>
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                            {p.year}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{p.description || 'No description'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No projects added yet. Click &ldquo;Edit Profile&rdquo; to add your projects.
                  </div>
                )}
              </div>
            </section>

            {/* Subjects */}
            <section id="subjects" className="scroll-mt-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Current Subjects</h2>
                {data.subjects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b dark:border-slate-700">
                          <th className="text-left py-2 px-3">Code</th>
                          <th className="text-left py-2 px-3">Subject</th>
                          <th className="text-center py-2 px-3">Credits</th>
                          <th className="text-left py-2 px-3">Faculty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.subjects.map((s) => (
                          <tr key={s.code} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <td className="py-3 px-3 font-mono text-indigo-600 dark:text-indigo-400">{s.code}</td>
                            <td className="py-3 px-3">{s.name}</td>
                            <td className="py-3 px-3 text-center">{s.credits}</td>
                            <td className="py-3 px-3">{s.facultyName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">No subjects assigned.</div>
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
                          <div className="text-xs text-slate-400">
                            {new Date(a.createdAt).toLocaleDateString()}
                          </div>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal
          data={data}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
          saving={saving}
        />
      )}
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
