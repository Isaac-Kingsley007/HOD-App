"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// TypeScript interfaces for key data structures
interface Section {
  id: string
  name: string
  totalStudents: number
  classAdvisor: string
  currentSemester: string
}

interface YearData {
  id: string
  title: string
  sections: Section[]
}

interface DocumentItem {
  id: string
  name: string
  category: string
  year: string
  lastUpdated: string
}

interface EventItem {
  id: string
  title: string
  date: string
  status: 'Planned' | 'Completed' | 'Ongoing'
  coordinator: string
}

// Dummy data for years and sections
const YEARS: YearData[] = [
  {
    id: 'y1',
    title: 'I Year',
    sections: [
      { id: 'y1a', name: 'CSE A', totalStudents: 60, classAdvisor: 'Dr. A. Kumar', currentSemester: 'I Sem' },
      { id: 'y1b', name: 'CSE B', totalStudents: 58, classAdvisor: 'Dr. S. Rao', currentSemester: 'I Sem' },
    ],
  },
  {
    id: 'y2',
    title: 'II Year',
    sections: [
      { id: 'y2a', name: 'CSE A', totalStudents: 62, classAdvisor: 'Dr. R. Mehta', currentSemester: 'III Sem' },
      { id: 'y2b', name: 'CSE B', totalStudents: 59, classAdvisor: 'Dr. L. Iyer', currentSemester: 'III Sem' },
    ],
  },
  {
    id: 'y3',
    title: 'III Year',
    sections: [
      { id: 'y3a', name: 'CSE A', totalStudents: 55, classAdvisor: 'Dr. N. Gupta', currentSemester: 'V Sem' },
      { id: 'y3b', name: 'CSE B', totalStudents: 53, classAdvisor: 'Dr. M. Singh', currentSemester: 'V Sem' },
    ],
  },
  {
    id: 'y4',
    title: 'IV Year',
    sections: [
      { id: 'y4a', name: 'CSE A', totalStudents: 50, classAdvisor: 'Dr. P. Joshi', currentSemester: 'VII Sem' },
      { id: 'y4b', name: 'CSE B', totalStudents: 48, classAdvisor: 'Dr. K. Verma', currentSemester: 'VII Sem' },
    ],
  },
]

// Dummy documents and events
const DOCUMENTS: DocumentItem[] = [
  { id: 'd1', name: 'Syllabus - I Year', category: 'Syllabus', year: 'I Year', lastUpdated: '2026-01-15' },
  { id: 'd2', name: 'Academic Calendar 2026', category: 'Calendar', year: 'All', lastUpdated: '2026-01-10' },
  { id: 'd3', name: 'Course File - Data Structures', category: 'Course', year: 'II Year', lastUpdated: '2025-12-12' },
]

const EVENTS: EventItem[] = [
  { id: 'e1', title: 'EICON Annual Fest', date: '2026-03-25', status: 'Planned', coordinator: 'Prof. A. Nair' },
  { id: 'e2', title: 'Guest Lecture: AI Ethics', date: '2026-02-18', status: 'Planned', coordinator: 'Dr. N. Gupta' },
  { id: 'e3', title: 'Industrial Visit - Infosys', date: '2025-11-05', status: 'Completed', coordinator: 'Prof. R. Das' },
]

// Reusable small components
const Sidebar: React.FC<{ activeId?: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const items: { label: string; id: string }[] = [
    { label: 'Overview', id: 'department-structure' },
    { label: 'Timetable & Scheduling', id: 'timetable-scheduling' },
    { label: 'Examination', id: 'examination' },
    { label: 'Communication', id: 'communication' },
    { label: 'Events', id: 'events' },
    { label: 'Reports', id: 'reports' },
    { label: 'Documents', id: 'documents' },
    { label: 'Feedback', id: 'feedback' },
  ]

  return (
    <aside className="w-64 min-w-[16rem] bg-slate-50 dark:bg-slate-900 border-r dark:border-slate-800 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">CSE Admin</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Administrative Modules</p>
      </div>
      <nav className="space-y-1">
        {items.map((it) => (
          <div
            key={it.id}
            onClick={() => onNavigate(it.id)}
            role="button"
            tabIndex={0}
            className={`px-3 py-2 rounded-md cursor-pointer select-none text-sm transition-all duration-200 transform hover:scale-102 hover:bg-slate-100 dark:hover:bg-slate-800 ${
              activeId === it.id ? 'bg-slate-200 dark:bg-slate-700 font-medium scale-102' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {it.label}
          </div>
        ))}
      </nav>
    </aside>
  )
}

const Header: React.FC = () => (
  <header className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
    <div>
      <h1 className="text-2xl font-semibold">CSE Department Admin Panel</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Manage years, sections, schedules and reports</p>
    </div>
    <div className="flex items-center gap-4">
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">New Announcement</button>
      <div className="text-sm text-slate-600 dark:text-slate-300">Admin</div>
    </div>
  </header>
)

const ModuleCard: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-medium mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
)

const StatsCard: React.FC<{ title: string; value: React.ReactNode }> = ({ title, value }) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
    <div className="text-sm text-slate-500 dark:text-slate-300">{title}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
)

// Year card that shows two section sub-cards
const YearCard: React.FC<{ year: YearData }> = ({ year }) => {
  const router = useRouter()
  
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-4">
      <h4 className="font-semibold mb-2">{year.title}</h4>
      <div className="flex flex-col sm:flex-row gap-3">
        {year.sections.map((s) => (
          <div key={s.id} className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-300">Advisor: {s.classAdvisor}</div>
                <div className="text-sm text-slate-600 dark:text-slate-200 mt-1">Total students: {s.totalStudents}</div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-200">{s.currentSemester}</div>
            </div>
            <div className="mt-3 text-right">
              <button onClick={() => router.push(`/Dashboard/Admin/section/${s.id}`)} className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">View Section</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DocumentTable: React.FC<{ docs: DocumentItem[] }> = ({ docs }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-left text-slate-500 dark:text-slate-300">
        <tr>
          <th className="pb-2">Document Name</th>
          <th className="pb-2">Category</th>
          <th className="pb-2">Year</th>
          <th className="pb-2">Last Updated</th>
          <th className="pb-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-slate-700 dark:text-slate-200">
        {docs.map((d) => (
          <tr key={d.id} className="border-t dark:border-slate-800">
            <td className="py-3">{d.name}</td>
            <td>{d.category}</td>
            <td>{d.year}</td>
            <td>{d.lastUpdated}</td>
            <td>
              <button className="text-indigo-600 dark:text-indigo-400">Open</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// Small components for specialized areas
const TimetableCard: React.FC<{ sectionName: string }> = ({ sectionName }) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
    <div className="text-sm text-slate-500">Timetable - {sectionName}</div>
    <div className="mt-2 h-24 bg-white/50 dark:bg-slate-700/50 rounded-md flex items-center justify-center text-slate-400">Weekly schedule placeholder</div>
  </div>
)

const ExamSection: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
      <div className="text-sm text-slate-500">Question Paper Submissions</div>
      <div className="mt-2 h-28 rounded-md bg-white/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">Table placeholder</div>
    </div>
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
      <div className="text-sm text-slate-500">Exam Schedule Overview</div>
      <div className="mt-2 h-28 rounded-md bg-white/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">Schedule placeholder</div>
    </div>
  </div>
)

const CommunicationPanel: React.FC = () => {
  const [audience, setAudience] = useState<'all' | 'year' | 'section'>('all')
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [selectedSection, setSelectedSection] = useState<string>('All')

  const availableSections = YEARS.find((y) => y.title === selectedYear)?.sections ?? []

  return (
    <div className="space-y-3">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
        <div className="text-sm text-slate-500">Create Circular</div>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="col-span-2 w-full p-2 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900" placeholder="Title" />
          <div className="flex items-center gap-3">
            <label className="text-sm">Target:</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value as any)} className="p-2 rounded-md bg-white dark:bg-slate-900 border dark:border-slate-700">
              <option value="all">All</option>
              <option value="year">Year-wise</option>
              <option value="section">Section-wise</option>
            </select>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          {audience !== 'all' && (
            <>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="p-2 rounded-md bg-white dark:bg-slate-900 border dark:border-slate-700">
                <option value="All">Select Year</option>
                {YEARS.map((y) => (
                  <option key={y.id} value={y.title}>{y.title}</option>
                ))}
              </select>

              {audience === 'section' && (
                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="p-2 rounded-md bg-white dark:bg-slate-900 border dark:border-slate-700">
                  <option value="All">Select Section</option>
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>

        <textarea className="w-full mt-4 p-2 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900" rows={4} placeholder="Message"></textarea>
        <div className="mt-2 flex items-center gap-2">
          <label className="text-sm">Send via:</label>
          <div className="flex items-center gap-2 text-sm">
            <label className="flex items-center gap-1"><input type="checkbox" /> Email</label>
            <label className="flex items-center gap-1"><input type="checkbox" /> SMS</label>
            <label className="flex items-center gap-1"><input type="checkbox" /> App</label>
          </div>
        </div>
        <div className="mt-2 text-right">
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Preview</button>
        </div>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
        <div className="text-sm text-slate-500">Upcoming Meetings</div>
        <ul className="mt-2 text-sm text-slate-700 dark:text-slate-200 space-y-2">
          <li>Department Meeting - 2026-02-10</li>
          <li>Academic Council - 2026-03-01</li>
        </ul>
      </div>
    </div>
  )
}

const ReportsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatsCard title="Placed Count" value={120} />
    <StatsCard title="Average Marks (Dept)" value={'72%'} />
    <StatsCard title="Pass % (Recent)" value={'88%'} />
  </div>
)

const EventList: React.FC<{ items: EventItem[] }> = ({ items: initialItems }) => {
  const [items, setItems] = useState<EventItem[]>(initialItems)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [coordinator, setCoordinator] = useState('')

  const addEvent = () => {
    if (!title || !date) return
    const newEvent: EventItem = { id: `e${Date.now()}`, title, date, status: 'Planned', coordinator: coordinator || 'TBD' }
    setItems((s) => [newEvent, ...s])
    setTitle('')
    setDate('')
    setCoordinator('')
  }

  const updateEventDate = (id: string, days: number) => {
    setItems((s) => s.map((ev) => {
      if (ev.id !== id) return ev
      const dt = new Date(ev.date)
      dt.setDate(dt.getDate() + days)
      return { ...ev, date: dt.toISOString().slice(0, 10) }
    }))
  }

  const markCompleted = (id: string) => {
    setItems((s) => s.map((ev) => ev.id === id ? { ...ev, status: 'Completed' } : ev))
  }

  // helper to decide visibility: if completed and more than 1 day past the event date, hide
  const visibleItems = items.filter((ev) => {
    const today = new Date()
    const evDate = new Date(ev.date)
    const nextDay = new Date(evDate)
    nextDay.setDate(evDate.getDate() + 1)
    if (ev.status === 'Completed' && today >= nextDay) return false
    // also hide events that are past more than 1 day and completed or not (optional)
    if (today > nextDay && ev.status === 'Completed') return false
    return true
  })

  return (
    <div>
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md mb-4">
        <div className="text-sm text-slate-500">Add Event</div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900" placeholder="Event Title" />
          <input value={date} onChange={(e) => setDate(e.target.value)} className="p-2 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900" type="date" />
          <input value={coordinator} onChange={(e) => setCoordinator(e.target.value)} className="p-2 rounded-md border dark:border-slate-700 bg-white dark:bg-slate-900" placeholder="Coordinator" />
        </div>
        <div className="mt-2 text-right">
          <button onClick={addEvent} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Add Event</button>
        </div>
      </div>

      <div className="space-y-2">
        {visibleItems.map((e) => (
          <div key={e.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-slate-500">{e.date} • {e.coordinator}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full text-xs bg-slate-200 dark:bg-slate-700">{e.status}</span>
              <button onClick={() => updateEventDate(e.id, 1)} className="text-sm px-2 py-1 bg-amber-500 text-white rounded">Postpone</button>
              <button onClick={() => updateEventDate(e.id, -1)} className="text-sm px-2 py-1 bg-sky-500 text-white rounded">Prepone</button>
              {e.status !== 'Completed' && <button onClick={() => markCompleted(e.id)} className="text-sm px-2 py-1 bg-indigo-600 text-white rounded">Mark Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const FeedbackTable: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
      <StatsCard title="Total Feedback" value={342} />
      <StatsCard title="Pending Grievances" value={12} />
      <StatsCard title="Resolved" value={320} />
    </div>
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
      <div className="text-sm text-slate-500">Recent Feedback / Grievances</div>
      <div className="mt-2 h-36 rounded-md bg-white/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">Table placeholder</div>
    </div>
  </div>
)

// Main page component exported as default
const CseAdminPage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('department-structure')

  // navigateTo scrolls smoothly and briefly highlights the target section
  const navigateTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // brief highlight animation: add ring then remove
    el.classList.add('ring-4', 'ring-indigo-300', 'dark:ring-indigo-500')
    el.classList.add('transition-all')
    setTimeout(() => {
      el.classList.remove('ring-4', 'ring-indigo-300', 'dark:ring-indigo-500')
    }, 900)
  }

  useEffect(() => {
    const sectionIds = ['department-structure','timetable-scheduling','examination','communication','events','reports','documents','feedback']
    const observers: IntersectionObserver[] = []
    const options = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(callback, options)
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 scroll-smooth">
      <div className="flex">
        <Sidebar activeId={activeId} onNavigate={navigateTo} />
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6 space-y-6">
            {/* Overview / Year cards */}
            <section id="department-structure" className="scroll-mt-24">
              <ModuleCard title="Department Structure">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {YEARS.map((y) => (
                    <YearCard key={y.id} year={y} />
                  ))}
                </div>
              </ModuleCard>
            </section>

            {/* Timetable & Scheduling */}
            <section id="timetable-scheduling" className="scroll-mt-24">
              <ModuleCard title="Timetable & Scheduling">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-sm text-slate-500 mb-2">Timetables</h5>
                    <TimetableCard sectionName="CSE A (Example)" />
                  </div>
                  <div>
                    <h5 className="text-sm text-slate-500 mb-2">Labs & Rooms</h5>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                      <div className="text-sm text-slate-600 dark:text-slate-300">Lab schedule / Room allocation placeholder</div>
                      <div className="mt-3 text-sm text-slate-700 dark:text-slate-200">Room 101 • Digital Systems Lab</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm text-slate-500 mb-2">Clash Detection</h5>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md h-full flex flex-col justify-between">
                      <div className="text-slate-400">Clash detection & auto-adjustments placeholder</div>
                      <div className="text-right mt-3">
                        <button className="px-3 py-1 bg-amber-500 text-white rounded-md text-sm">Run Detection</button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModuleCard>
            </section>

            {/* Examination & Question Papers */}
            <section id="examination" className="scroll-mt-24">
              <ModuleCard title="Examination & Question Papers">
                <ExamSection />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <div className="text-sm text-slate-500">Marks Entry Status</div>
                    <div className="mt-2 h-20 rounded-md bg-white/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">Status placeholder</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <div className="text-sm text-slate-500">Pass %</div>
                    <div className="text-2xl font-semibold mt-2">88%</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <div className="text-sm text-slate-500">Average Marks</div>
                    <div className="text-2xl font-semibold mt-2">72%</div>
                  </div>
                </div>
              </ModuleCard>
            </section>

            {/* Communication & Notifications */}
            <section id="communication" className="scroll-mt-24">
              <ModuleCard title="Communication & Notifications">
                <CommunicationPanel />
              </ModuleCard>
            </section>

            {/* Events & Association */}
            <section id="events" className="scroll-mt-24">
              <ModuleCard title="Event & Association Module">
                <EventList items={EVENTS} />
              </ModuleCard>
            </section>

            {/* Reports & Analytics */}
            <section id="reports" className="scroll-mt-24">
              <ModuleCard title="Reports & Analytics">
                <ReportsGrid />
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <div className="text-sm text-slate-500">Faculty Workload (Overview)</div>
                    <div className="mt-2 h-24 rounded-md bg-white/50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400">Widget placeholder</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                    <div className="text-sm text-slate-500">NAAC / NBA Readiness</div>
                    <div className="mt-2 space-y-2">
                      <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">Syllabus: Ready</div>
                      <div className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded">Documentation: In Progress</div>
                    </div>
                  </div>
                </div>
              </ModuleCard>
            </section>

            {/* Document Repository */}
            <section id="documents" className="scroll-mt-24">
              <ModuleCard title="Document Repository">
                <DocumentTable docs={DOCUMENTS} />
              </ModuleCard>
            </section>

            {/* Feedback & Grievances */}
            <section id="feedback" className="scroll-mt-24">
              <ModuleCard title="Feedback & Grievances">
                <FeedbackTable />
              </ModuleCard>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CseAdminPage