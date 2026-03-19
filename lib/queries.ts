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
    dob: student.dob?.toISOString().slice(0, 10) ?? '',
    bloodGroup: student.bloodGroup ?? '',
    parentName: student.parentName ?? '',
    parentPhone: student.parentPhone ?? '',
    achievements: student.achievements ?? '',
    attendancePercent: latestAttendance?.percent ?? 0,
    marks: student.marks.map((m) => ({
      semester: m.semester,
      gpa: m.gpa ?? undefined,
      percentage: m.percentage ?? undefined,
    })),
    certifications: student.certifications.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date.toISOString().slice(0, 10),
    })),
    projects: student.projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? '',
      year: p.year,
    })),
    attendance: student.attendance.map((a) => ({
      semester: a.semester,
      percent: a.percent,
    })),
  }
}

// ============ Student Dashboard (full) ============

export async function getStudentDashboardData(studentSlug: string) {
  const student = await prisma.student.findUnique({
    where: { slug: studentSlug },
    include: {
      section: {
        include: {
          year: true,
          subjectAssignments: {
            include: { subject: true, faculty: true },
          },
        },
      },
      marks: { orderBy: { semester: 'asc' } },
      subjectMarks: { orderBy: { semester: 'asc' } },
      certifications: { orderBy: { date: 'desc' } },
      projects: { orderBy: { year: 'desc' } },
      attendance: { orderBy: { semester: 'asc' } },
    },
  })

  if (!student) return null

  const announcements = await prisma.announcement.findMany({
    where: { target: { in: ['all', 'students'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return {
    id: student.slug,
    name: student.name,
    rollNo: student.rollNo,
    regNo: student.regNo ?? '',
    email: student.email,
    phone: student.phone ?? '',
    address: student.address ?? '',
    image: student.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.slug}`,
    dob: student.dob?.toISOString().slice(0, 10) ?? '',
    bloodGroup: student.bloodGroup ?? '',
    parentName: student.parentName ?? '',
    parentPhone: student.parentPhone ?? '',
    achievements: student.achievements ?? '',
    sectionName: student.section.name,
    yearName: student.section.year.name,
    currentSemester: student.section.currentSemester,
    marks: student.marks.map((m) => ({
      semester: m.semester,
      gpa: m.gpa ?? undefined,
      percentage: m.percentage ?? undefined,
    })),
    subjectMarks: student.subjectMarks.map((sm) => ({
      id: sm.id,
      subjectCode: sm.subjectCode,
      subjectName: sm.subjectName,
      semester: sm.semester,
      internal1: sm.internal1,
      internal2: sm.internal2,
      internal3: sm.internal3,
      assignment: sm.assignment,
      exam: sm.exam,
      total: sm.total,
      grade: sm.grade,
    })),
    certifications: student.certifications.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date.toISOString().slice(0, 10),
    })),
    projects: student.projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? '',
      year: p.year,
    })),
    attendance: student.attendance.map((a) => ({
      semester: a.semester,
      percent: a.percent,
    })),
    subjects: student.section.subjectAssignments.map((a) => ({
      code: a.subject.code,
      name: a.subject.name,
      credits: a.subject.credits,
      facultyName: a.faculty.name,
    })),
    announcements: announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      postedBy: a.postedBy,
      createdAt: a.createdAt.toISOString(),
    })),
  }
}

// ============ Faculty Dashboard ============

export async function getFacultyDashboardData(facultyId: string) {
  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    include: {
      classAdvisorSections: {
        include: {
          year: true,
          _count: { select: { students: true } },
        },
      },
      subjectAssignments: {
        include: {
          subject: true,
          section: {
            include: {
              year: true,
              students: {
                orderBy: { rollNo: 'asc' },
                select: { id: true, slug: true, name: true, rollNo: true },
              },
            },
          },
        },
      },
    },
  })

  if (!faculty) return null

  const announcements = await prisma.announcement.findMany({
    where: { target: { in: ['all', 'faculty'] } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return {
    id: faculty.id,
    name: faculty.name,
    designation: faculty.designation,
    email: faculty.email,
    phone: faculty.phone ?? '',
    qualification: faculty.qualification ?? '',
    expertise: faculty.expertise ?? '',
    image: faculty.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${faculty.id}`,
    advisorSections: faculty.classAdvisorSections.map((s) => ({
      id: s.sectionCode,
      name: s.name,
      yearName: s.year.name,
      currentSemester: s.currentSemester,
      studentCount: s._count.students,
    })),
    assignments: faculty.subjectAssignments.map((a) => ({
      id: a.id,
      subjectCode: a.subject.code,
      subjectName: a.subject.name,
      credits: a.subject.credits,
      sectionId: a.section.sectionCode,
      sectionName: `${a.section.name} - ${a.section.year.name}`,
      currentSemester: a.section.currentSemester,
      students: a.section.students.map((st) => ({
        id: st.id,
        slug: st.slug,
        name: st.name,
        rollNo: st.rollNo,
      })),
    })),
    announcements: announcements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      postedBy: a.postedBy,
      createdAt: a.createdAt.toISOString(),
    })),
  }
}

// ============ All Students (for selection) ============

export async function getAllStudents() {
  const students = await prisma.student.findMany({
    orderBy: { rollNo: 'asc' },
    include: { section: { include: { year: true } } },
  })
  return students.map((s) => ({
    slug: s.slug,
    name: s.name,
    rollNo: s.rollNo,
    sectionName: s.section.name,
    yearName: s.section.year.name,
  }))
}

// ============ All Faculty (for selection) ============

export async function getAllFaculty() {
  const faculty = await prisma.faculty.findMany({
    orderBy: { name: 'asc' },
  })
  return faculty.map((f) => ({
    id: f.id,
    name: f.name,
    designation: f.designation,
    email: f.email,
  }))
}
