import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Years
  const y1 = await prisma.year.upsert({ where: { order: 1 }, update: {}, create: { name: 'I Year', order: 1 } })
  const y2 = await prisma.year.upsert({ where: { order: 2 }, update: {}, create: { name: 'II Year', order: 2 } })
  const y3 = await prisma.year.upsert({ where: { order: 3 }, update: {}, create: { name: 'III Year', order: 3 } })
  const y4 = await prisma.year.upsert({ where: { order: 4 }, update: {}, create: { name: 'IV Year', order: 4 } })

  // Faculty - get or create
  let f1 = await prisma.faculty.findFirst({ where: { email: 'n.gupta@college.edu' } })
  if (!f1) f1 = await prisma.faculty.create({ data: { name: 'Dr. N. Gupta', designation: 'Associate Professor', email: 'n.gupta@college.edu', phone: '9876543210' } })
  let f2 = await prisma.faculty.findFirst({ where: { email: 'p.joshi@college.edu' } })
  if (!f2) f2 = await prisma.faculty.create({ data: { name: 'Dr. P. Joshi', designation: 'Assistant Professor', email: 'p.joshi@college.edu', phone: '9876543211' } })
  let f3 = await prisma.faculty.findFirst({ where: { email: 's.rao@college.edu' } })
  if (!f3) f3 = await prisma.faculty.create({ data: { name: 'Dr. S. Rao', designation: 'Associate Professor', email: 's.rao@college.edu', phone: '9876543212' } })

  // Subjects
  const sub1 = await prisma.subject.upsert({ where: { code: 'CS301' }, update: {}, create: { code: 'CS301', name: 'Operating Systems', credits: 4 } })
  const sub2 = await prisma.subject.upsert({ where: { code: 'CS302' }, update: {}, create: { code: 'CS302', name: 'Database Systems', credits: 4 } })
  const sub3 = await prisma.subject.upsert({ where: { code: 'CS303' }, update: {}, create: { code: 'CS303', name: 'Web Technologies', credits: 3 } })
  const sub4 = await prisma.subject.upsert({ where: { code: 'CS304' }, update: {}, create: { code: 'CS304', name: 'Data Structures', credits: 4 } })

  // Sections with class advisors
  const y1a = await prisma.section.upsert({
    where: { sectionCode: 'y1a' },
    update: {},
    create: {
      sectionCode: 'y1a',
      name: 'CSE A',
      currentSemester: 'I Sem',
      yearId: y1.id,
      classAdvisorId: f1.id,
    },
  })
  await prisma.section.upsert({
    where: { sectionCode: 'y1b' },
    update: {},
    create: {
      sectionCode: 'y1b',
      name: 'CSE B',
      currentSemester: 'I Sem',
      yearId: y1.id,
      classAdvisorId: f3.id,
    },
  })

  // Add sections for years 2, 3, 4 (for Admin dashboard to show all years)
  await prisma.section.upsert({ where: { sectionCode: 'y2a' }, update: {}, create: { sectionCode: 'y2a', name: 'CSE A', currentSemester: 'III Sem', yearId: y2.id, classAdvisorId: f1.id } })
  await prisma.section.upsert({ where: { sectionCode: 'y2b' }, update: {}, create: { sectionCode: 'y2b', name: 'CSE B', currentSemester: 'III Sem', yearId: y2.id, classAdvisorId: f2.id } })
  await prisma.section.upsert({ where: { sectionCode: 'y3a' }, update: {}, create: { sectionCode: 'y3a', name: 'CSE A', currentSemester: 'V Sem', yearId: y3.id, classAdvisorId: f1.id } })
  await prisma.section.upsert({ where: { sectionCode: 'y3b' }, update: {}, create: { sectionCode: 'y3b', name: 'CSE B', currentSemester: 'V Sem', yearId: y3.id, classAdvisorId: f3.id } })
  await prisma.section.upsert({ where: { sectionCode: 'y4a' }, update: {}, create: { sectionCode: 'y4a', name: 'CSE A', currentSemester: 'VII Sem', yearId: y4.id, classAdvisorId: f2.id } })
  await prisma.section.upsert({ where: { sectionCode: 'y4b' }, update: {}, create: { sectionCode: 'y4b', name: 'CSE B', currentSemester: 'VII Sem', yearId: y4.id, classAdvisorId: f1.id } })

  // Section-Subject-Faculty assignments for y1a
  await prisma.sectionSubject.upsert({
    where: { sectionId_subjectId: { sectionId: y1a.id, subjectId: sub1.id } },
    update: {},
    create: { sectionId: y1a.id, subjectId: sub1.id, facultyId: f1.id },
  })
  await prisma.sectionSubject.upsert({
    where: { sectionId_subjectId: { sectionId: y1a.id, subjectId: sub2.id } },
    update: {},
    create: { sectionId: y1a.id, subjectId: sub2.id, facultyId: f2.id },
  })
  await prisma.sectionSubject.upsert({
    where: { sectionId_subjectId: { sectionId: y1a.id, subjectId: sub3.id } },
    update: {},
    create: { sectionId: y1a.id, subjectId: sub3.id, facultyId: f3.id },
  })
  await prisma.sectionSubject.upsert({
    where: { sectionId_subjectId: { sectionId: y1a.id, subjectId: sub4.id } },
    update: {},
    create: { sectionId: y1a.id, subjectId: sub4.id, facultyId: f1.id },
  })

  // Sample students for y1a
  for (let i = 1; i <= 10; i++) {
    const slug = `y1a-s${i}`
    const student = await prisma.student.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: `Student ${i}`,
        rollNo: `Y1A${String(i).padStart(3, '0')}`,
        regNo: `REG-${slug}`,
        email: `student${i}@college.edu`,
        phone: `9876543${String(i).padStart(3, '0')}`,
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}`,
        sectionId: y1a.id,
      },
    })
    await prisma.studentMark.upsert({
      where: { studentId_semester: { studentId: student.id, semester: 'I' } },
      update: {},
      create: { studentId: student.id, semester: 'I', percentage: 78 },
    })
    await prisma.studentAttendance.upsert({
      where: { studentId_semester: { studentId: student.id, semester: 'I' } },
      update: {},
      create: { studentId: student.id, semester: 'I', percent: 92 },
    })
  }

  // Add certifications and projects for y1a-s1
  const sampleStudent = await prisma.student.findFirst({ where: { slug: 'y1a-s1' } })
  if (sampleStudent) {
    const existingCerts = await prisma.studentCertification.count({ where: { studentId: sampleStudent.id } })
    if (existingCerts === 0) {
      await prisma.studentCertification.createMany({
        data: [
          { studentId: sampleStudent.id, title: 'AWS Cloud Practitioner', issuer: 'Amazon', date: new Date('2025-06-12') },
          { studentId: sampleStudent.id, title: 'React Professional', issuer: 'Udemy', date: new Date('2024-11-05') },
        ],
      })
      await prisma.studentProject.createMany({
        data: [
          { studentId: sampleStudent.id, title: 'Smart Attendance System', description: 'Face-recognition based attendance tracking', year: '2025' },
          { studentId: sampleStudent.id, title: 'E-Learning Platform', description: 'MERN stack learning management', year: '2024' },
        ],
      })
    }
  }

  // Documents
  const docCount = await prisma.document.count()
  if (docCount === 0) {
    await prisma.document.createMany({
      data: [
        { name: 'Syllabus - I Year', category: 'Syllabus', year: 'I Year', lastUpdated: new Date('2026-01-15') },
        { name: 'Academic Calendar 2026', category: 'Calendar', year: 'All', lastUpdated: new Date('2026-01-10') },
        { name: 'Course File - Data Structures', category: 'Course', year: 'II Year', lastUpdated: new Date('2025-12-12') },
      ],
    })
  }

  // Events
  const eventCount = await prisma.event.count()
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        { title: 'EICON Annual Fest', date: new Date('2026-03-25'), status: 'Planned', coordinator: 'Prof. A. Nair' },
        { title: 'Guest Lecture: AI Ethics', date: new Date('2026-02-18'), status: 'Planned', coordinator: 'Dr. N. Gupta' },
        { title: 'Industrial Visit - Infosys', date: new Date('2025-11-05'), status: 'Completed', coordinator: 'Prof. R. Das' },
      ],
    })
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
