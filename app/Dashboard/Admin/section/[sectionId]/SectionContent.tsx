'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

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

interface SectionData {
  sectionId: string
  yearTitle: string
  sectionName: string
  currentSemester: string
  totalStudents: number
  classAdvisor: string
  students: Student[]
  facultyList: Faculty[]
  subjects: Subject[]
}

const SectionHeader: React.FC<{ data: SectionData; onBack: () => void }> = ({ data, onBack }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-800 text-white px-6 py-6 flex items-center justify-between">
    <div>
      <button onClick={onBack} className="text-sm mb-2 hover:text-indigo-200">← Back</button>
      <h1 className="text-3xl font-semibold">{data.sectionName} — {data.yearTitle}</h1>
      <p className="text-sm text-indigo-100 mt-1">Class Details & Management</p>
    </div>
    <div className="text-right">
      <div className="text-4xl font-bold">{data.totalStudents}</div>
      <div className="text-sm text-indigo-100">Total Students</div>
    </div>
  </div>
)

const ClassOverview: React.FC<{ data: SectionData }> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Total Students</div>
      <div className="text-2xl font-semibold mt-2">{data.totalStudents}</div>
    </div>
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Class Advisor</div>
      <div className="text-lg font-semibold mt-2">{data.classAdvisor}</div>
    </div>
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Current Semester</div>
      <div className="text-lg font-semibold mt-2">{data.currentSemester}</div>
    </div>
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">Subjects</div>
      <div className="text-lg font-semibold mt-2">{data.subjects.length}</div>
    </div>
  </div>
)

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

export default function SectionContent({ data }: { data: SectionData }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
      <SectionHeader data={data} onBack={() => router.back()} />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <ClassOverview data={data} />
        <FacultySection facultyList={data.facultyList} />
        <SubjectsSection subjects={data.subjects} />
        <StudentList students={data.students} />
      </main>
    </div>
  )
}
