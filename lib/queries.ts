/**
 * Server-side data fetching functions for Admin, Section, and Student pages.
 * Use these in Server Components or API routes.
 */

import { prisma } from './db'

// ============ Admin Dashboard ============

export async function getAdminDashboardData() {
  const years = await prisma.year.findMany({
    orderBy: { order: 'asc' },
    include: {
      sections: {
        include: {
          _count: { select: { students: true } },
          classAdvisor: { select: { name: true } },
        },
      },
    },
  })

  const documents = await prisma.document.findMany({
    orderBy: { lastUpdated: 'desc' },
  })

  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  })

  return {
    years: years.map((y) => ({
      id: y.id,
      title: y.name,
      sections: y.sections.map((s) => ({
        id: s.sectionCode,
        name: s.name,
        totalStudents: s._count.students,
        classAdvisor: s.classAdvisor?.name ?? 'TBD',
        currentSemester: s.currentSemester,
      })),
    })),
    documents: documents.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      year: d.year,
      lastUpdated: d.lastUpdated.toISOString().slice(0, 10),
    })),
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date.toISOString().slice(0, 10),
      status: e.status as 'Planned' | 'Completed' | 'Ongoing',
      coordinator: e.coordinator,
    })),
  }
}

// ============ Section Detail ============

export async function getSectionDetail(sectionCode: string) {
  const section = await prisma.section.findUnique({
    where: { sectionCode },
    include: {
      year: { select: { name: true } },
      classAdvisor: true,
      students: {
        orderBy: { rollNo: 'asc' },
      },
      subjectAssignments: {
        include: {
          subject: true,
          faculty: true,
        },
      },
    },
  })

  if (!section) return null

  // Get unique faculty from subject assignments
  const facultyMap = new Map<string, { id: string; name: string; designation: string; email: string; phone: string | undefined }>()
  section.subjectAssignments.forEach((a) => {
    if (!facultyMap.has(a.faculty.id)) {
      facultyMap.set(a.faculty.id, {
        id: a.faculty.id,
        name: a.faculty.name,
        designation: a.faculty.designation,
        email: a.faculty.email,
        phone: a.faculty.phone ?? undefined,
      })
    }
  })
  if (section.classAdvisor && !facultyMap.has(section.classAdvisor.id)) {
    facultyMap.set(section.classAdvisor.id, {
      id: section.classAdvisor.id,
      name: section.classAdvisor.name,
      designation: section.classAdvisor.designation,
      email: section.classAdvisor.email,
      phone: section.classAdvisor.phone ?? undefined,
    })
  }

  return {
    sectionId: section.sectionCode,
    yearTitle: section.year.name,
    sectionName: section.name,
    currentSemester: section.currentSemester,
    totalStudents: section.students.length,
    classAdvisor: section.classAdvisor?.name ?? 'TBD',
    students: section.students.map((s) => ({
      id: s.slug,
      name: s.name,
      rollNo: s.rollNo,
      email: s.email,
      phone: s.phone ?? undefined,
      image: s.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.slug}`,
    })),
    facultyList: Array.from(facultyMap.values()),
    subjects: section.subjectAssignments.map((a) => ({
      code: a.subject.code,
      name: a.subject.name,
      credits: a.subject.credits,
      facultyId: a.faculty.id,
      facultyName: a.faculty.name,
    })),
  }
}

// ============ Student Profile ============

export async function getStudentProfile(studentSlug: string) {
  const student = await prisma.student.findUnique({
    where: { slug: studentSlug },
    include: {
      marks: { orderBy: { semester: 'asc' } },
      certifications: { orderBy: { date: 'desc' } },
      projects: { orderBy: { year: 'desc' } },
      attendance: { orderBy: { semester: 'asc' } },
    },
  })

  if (!student) return null

  const latestAttendance = student.attendance[student.attendance.length - 1]

  return {
    id: student.slug,
    name: student.name,
    rollNo: student.rollNo,
    regNo: student.regNo ?? `REG-${student.slug}`,
    email: student.email,
    phone: student.phone ?? '',
    address: student.address ?? '',
    image: student.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.slug}`,
    attendancePercent: latestAttendance?.percent ?? 0,
    marks: student.marks.map((m) => ({
      semester: m.semester,
      gpa: m.gpa ?? undefined,
      percentage: m.percentage ?? undefined,
    })),
    certifications: student.certifications.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      date: c.date.toISOString().slice(0, 10),
    })),
    projects: student.projects.map((p) => ({
      title: p.title,
      description: p.description ?? '',
      year: p.year,
    })),
  }
}
