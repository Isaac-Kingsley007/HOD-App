import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function main() {
  // Years
  const y1 = await prisma.year.upsert({ where: { order: 1 }, update: {}, create: { name: 'I Year', order: 1 } })
  const y2 = await prisma.year.upsert({ where: { order: 2 }, update: {}, create: { name: 'II Year', order: 2 } })
  const y3 = await prisma.year.upsert({ where: { order: 3 }, update: {}, create: { name: 'III Year', order: 3 } })
  const y4 = await prisma.year.upsert({ where: { order: 4 }, update: {}, create: { name: 'IV Year', order: 4 } })

  // Faculty - get or create
  let f1 = await prisma.faculty.findFirst({ where: { email: 'n.gupta@college.edu' } })
  if (!f1) f1 = await prisma.faculty.create({ data: { name: 'Dr. N. Gupta', designation: 'Associate Professor', email: 'n.gupta@college.edu', phone: '9876543210', qualification: 'Ph.D in Computer Science', expertise: 'Machine Learning, Data Science' } })
  else { await prisma.faculty.update({ where: { id: f1.id }, data: { qualification: 'Ph.D in Computer Science', expertise: 'Machine Learning, Data Science' } }) }

  let f2 = await prisma.faculty.findFirst({ where: { email: 'p.joshi@college.edu' } })
  if (!f2) f2 = await prisma.faculty.create({ data: { name: 'Dr. P. Joshi', designation: 'Assistant Professor', email: 'p.joshi@college.edu', phone: '9876543211', qualification: 'Ph.D in Software Engineering', expertise: 'Database Systems, Cloud Computing' } })
  else { await prisma.faculty.update({ where: { id: f2.id }, data: { qualification: 'Ph.D in Software Engineering', expertise: 'Database Systems, Cloud Computing' } }) }

  let f3 = await prisma.faculty.findFirst({ where: { email: 's.rao@college.edu' } })
  if (!f3) f3 = await prisma.faculty.create({ data: { name: 'Dr. S. Rao', designation: 'Associate Professor', email: 's.rao@college.edu', phone: '9876543212', qualification: 'M.Tech in Information Technology', expertise: 'Web Technologies, Cybersecurity' } })
  else { await prisma.faculty.update({ where: { id: f3.id }, data: { qualification: 'M.Tech in Information Technology', expertise: 'Web Technologies, Cybersecurity' } }) }

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

  // ============ Subject Marks (uploaded by faculty) ============
  // Add subject marks for y1a students for CS301 (OS by f1) and CS302 (DBMS by f2)
  const y1aStudents = await prisma.student.findMany({ where: { section: { sectionCode: 'y1a' } }, orderBy: { rollNo: 'asc' } })

  for (const st of y1aStudents) {
    // CS301 - Operating Systems marks
    const i1 = Math.round(15 + Math.random() * 10)
    const i2 = Math.round(14 + Math.random() * 11)
    const asgnMark = Math.round(5 + Math.random() * 5)
    const examMark = Math.round(40 + Math.random() * 50)
    const total = i1 + i2 + asgnMark + examMark
    const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'B+' : total >= 50 ? 'B' : total >= 40 ? 'C' : 'F'

    await prisma.subjectMark.upsert({
      where: { studentId_subjectCode_semester: { studentId: st.id, subjectCode: 'CS301', semester: 'I' } },
      update: {},
      create: {
        studentId: st.id,
        subjectCode: 'CS301',
        subjectName: 'Operating Systems',
        semester: 'I',
        internal1: i1,
        internal2: i2,
        assignment: asgnMark,
        exam: examMark,
        total,
        grade,
        uploadedById: f1.id,
      },
    })

    // CS302 - Database Systems marks
    const d_i1 = Math.round(12 + Math.random() * 13)
    const d_i2 = Math.round(13 + Math.random() * 12)
    const d_asgn = Math.round(4 + Math.random() * 6)
    const d_exam = Math.round(35 + Math.random() * 55)
    const d_total = d_i1 + d_i2 + d_asgn + d_exam
    const d_grade = d_total >= 90 ? 'O' : d_total >= 80 ? 'A+' : d_total >= 70 ? 'A' : d_total >= 60 ? 'B+' : d_total >= 50 ? 'B' : d_total >= 40 ? 'C' : 'F'

    await prisma.subjectMark.upsert({
      where: { studentId_subjectCode_semester: { studentId: st.id, subjectCode: 'CS302', semester: 'I' } },
      update: {},
      create: {
        studentId: st.id,
        subjectCode: 'CS302',
        subjectName: 'Database Systems',
        semester: 'I',
        internal1: d_i1,
        internal2: d_i2,
        assignment: d_asgn,
        exam: d_exam,
        total: d_total,
        grade: d_grade,
        uploadedById: f2.id,
      },
    })
  }

  // ============ Announcements ============
  const annCount = await prisma.announcement.count()
  if (annCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Internal Assessment 1 Schedule',
          content: 'IA-1 for all subjects will be held from March 10-14, 2026. Please prepare accordingly.',
          target: 'all',
          postedBy: 'HOD - CSE',
        },
        {
          title: 'Workshop on Cloud Computing',
          content: 'A hands-on workshop on AWS Cloud will be conducted on March 5, 2026. Interested students can register.',
          target: 'students',
          postedBy: 'Dr. P. Joshi',
        },
        {
          title: 'Faculty Meeting - Curriculum Review',
          content: 'All faculty members are requested to attend the curriculum review meeting on Feb 25, 2026 at 2:00 PM.',
          target: 'faculty',
          postedBy: 'HOD - CSE',
        },
        {
          title: 'Placement Drive - Infosys',
          content: 'Infosys campus placement drive is scheduled for April 15, 2026. Eligible students please register before March 30.',
          target: 'students',
          postedBy: 'Placement Cell',
        },
      ],
    })
  }

  // Update student 1 with additional profile data
  if (y1aStudents.length > 0) {
    await prisma.student.update({
      where: { id: y1aStudents[0].id },
      data: {
        dob: new Date('2005-06-15'),
        bloodGroup: 'O+',
        parentName: 'Mr. Raj Kumar',
        parentPhone: '9876543100',
        achievements: 'Won 1st prize in Inter-College Coding Competition 2025\nNational Level Science Quiz Finalist\nSchool Topper in Class 12',
      },
    })
  }

  console.log('Extended seed data added successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
