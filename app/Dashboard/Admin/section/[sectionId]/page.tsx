'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

// Types
interface Student {
  id: string
  name: string
  rollNo: string
  email: string
  phone?: string
  image?: string
}

interface Faculty {
  id: string
  name: string
  designation: string
  email: string
  phone?: string
}

interface Subject {
  code: string
  name: string
  credits: number
  facultyId: string
  facultyName: string
}

// Dummy data generator
const generateDummyData = (sectionId: string) => {
  const isYearOne = sectionId.startsWith('y1')
  const isSectionA = sectionId.endsWith('a')
  const studentCount = isSectionA ? 60 : 58

  const students: Student[] = Array.from({ length: studentCount }).map((_, i) => ({
    id: `${sectionId}-s${i + 1}`,
    name: `Student ${i + 1}`,
    rollNo: `${sectionId.toUpperCase()}${String(i + 1).padStart(3, '0')}`,
    email: `student${i + 1}@college.edu`,
    phone: `9876543${String(i).padStart(3, '0')}`,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sectionId}-s${i + 1}`,
  }))

  const facultyList: Faculty[] = [
    { id: 'f1', name: 'Dr. N. Gupta', designation: 'Associate Professor', email: 'n.gupta@college.edu', phone: '9876543210' },
    { id: 'f2', name: 'Dr. P. Joshi', designation: 'Assistant Professor', email: 'p.joshi@college.edu', phone: '9876543211' },
    { id: 'f3', name: 'Dr. S. Rao', designation: 'Associate Professor', email: 's.rao@college.edu', phone: '9876543212' },
  ]

  const subjects: Subject[] = [
    { code: 'CS301', name: 'Operating Systems', credits: 4, facultyId: 'f1', facultyName: 'Dr. N. Gupta' },
    { code: 'CS302', name: 'Database Systems', credits: 4, facultyId: 'f2', facultyName: 'Dr. P. Joshi' },
    { code: 'CS303', name: 'Web Technologies', credits: 3, facultyId: 'f3', facultyName: 'Dr. S. Rao' },
    { code: 'CS304', name: 'Data Structures', credits: 4, facultyId: 'f1', facultyName: 'Dr. N. Gupta' },
  ]

  return { students, facultyList, subjects }
}

// Section header component
const SectionHeader: React.FC<{ sectionId: string; onBack: () => void }> = ({ sectionId, onBack }) => {
  const yearMap: { [key: string]: string } = {
    y1: 'I Year',
    y2: 'II Year',
    y3: 'III Year',
    y4: 'IV Year',
  }

  const year = Object.keys(yearMap).find((k) => sectionId.startsWith(k))
  const section = sectionId.endsWith('a') ? 'CSE A' : 'CSE B'
  const yearTitle = year ? yearMap[year] : 'Unknown'

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-800 text-white px-6 py-6 flex items-center justify-between">
      <div>
        <button onClick={onBack} className="text-sm mb-2 hover:text-indigo-200">← Back</button>
        <h1 className="text-3xl font-semibold">{section} — {yearTitle}</h1>
        <p className="text-sm text-indigo-100 mt-1">Class Details & Management</p>
      </div>
      <div className="text-right">
        <div className="text-4xl font-bold">60</div>
        <div className="text-sm text-indigo-100">Total Students</div>
      </div>
    </div>
  )
}

// Class overview cards
const ClassOverview: React.FC<{ sectionId: string; studentCount: number }> = ({ sectionId, studentCount }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Total Students</div>
      <div className="text-2xl font-semibold mt-2">{studentCount}</div>
    </div>
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Class Advisor</div>
      <div className="text-lg font-semibold mt-2">Dr. N. Gupta</div>
    </div>
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Current Semester</div>
      <div className="text-lg font-semibold mt-2">V Semester</div>
    </div>
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Subjects</div>
      <div className="text-lg font-semibold mt-2">4</div>
    </div>
  </div>
)

// Faculty list component
const FacultySection: React.FC<{ facultyList: Faculty[] }> = ({ facultyList }) => (
  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Faculty & Coordinators</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {facultyList.map((f) => (
        <div key={f.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
          <div className="font-medium">{f.name}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{f.designation}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            <div>{f.email}</div>
            <div>{f.phone}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Subjects section
const SubjectsSection: React.FC<{ subjects: Subject[] }> = ({ subjects }) => (
  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6 shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Subjects & Faculty Assignment</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b dark:border-slate-800">
            <th className="text-left py-3 px-2">Code</th>
            <th className="text-left py-3 px-2">Subject Name</th>
            <th className="text-left py-3 px-2">Credits</th>
            <th className="text-left py-3 px-2">Faculty</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s) => (
            <tr key={s.code} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
              <td className="py-3 px-2 font-mono text-indigo-600 dark:text-indigo-400">{s.code}</td>
              <td className="py-3 px-2">{s.name}</td>
              <td className="py-3 px-2">{s.credits}</td>
              <td className="py-3 px-2">{s.facultyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

// Student list with search and filter
const StudentList: React.FC<{ students: Student[] }> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const router = useRouter()

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Students ({filtered.length}/{students.length})</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1 rounded text-sm ${view === 'grid' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded text-sm ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            List
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, roll no, or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-4 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
      />

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((s) => (
              <div key={s.id} onClick={() => router.push(`/Dashboard/Admin/student/${s.id}`)} className="cursor-pointer text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:shadow-md transition-shadow">
                <img src={s.image} alt={s.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.rollNo}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">{s.email}</div>
              </div>
            ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => (
            <div key={s.id} onClick={() => router.push(`/Dashboard/Admin/student/${s.id}`)} className="cursor-pointer flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <img src={s.image} alt={s.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-slate-500">{s.rollNo}</div>
              </div>
              <div className="text-right text-sm">
                <div className="text-slate-600 dark:text-slate-300">{s.email}</div>
                <div className="text-slate-500 dark:text-slate-400">{s.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main page component
export default function SectionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const sectionId = params.sectionId as string

  const { students, facultyList, subjects } = generateDummyData(sectionId)

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
      <SectionHeader sectionId={sectionId} onBack={() => router.back()} />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Class Overview */}
        <ClassOverview sectionId={sectionId} studentCount={students.length} />

        {/* Faculty Section */}
        <FacultySection facultyList={facultyList} />

        {/* Subjects Section */}
        <SubjectsSection subjects={subjects} />

        {/* Students Section */}
        <StudentList students={students} />
      </main>
    </div>
  )
}
