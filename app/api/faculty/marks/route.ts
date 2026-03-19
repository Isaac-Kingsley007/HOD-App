import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from "@/lib/auth-helpers"

// POST /api/faculty/marks — Upload marks for students
export async function POST(request: Request) {
  const { error, session } = await requireAuth(["faculty"])
  if (error) return error

  try {
    const body = await request.json()
    const { facultyId, subjectCode, subjectName, semester, marks } = body

    if (!facultyId || !subjectCode || !subjectName || !semester || !marks || !Array.isArray(marks)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Faculty can only upload marks if it's their own ID
    if (session!.user.facultyId !== facultyId) {
      return NextResponse.json(
        { error: "Forbidden - You can only upload marks for yourself" },
        { status: 403 }
      )
    }

    const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } })
    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 })
    }

    const results = []
    for (const mark of marks) {
      const student = await prisma.student.findUnique({ where: { id: mark.studentId } })
      if (!student) continue

      const upserted = await prisma.subjectMark.upsert({
        where: {
          studentId_subjectCode_semester: {
            studentId: student.id,
            subjectCode,
            semester,
          },
        },
        update: {
          subjectName,
          internal1: mark.internal1 ?? null,
          internal2: mark.internal2 ?? null,
          internal3: mark.internal3 ?? null,
          assignment: mark.assignment ?? null,
          exam: mark.exam ?? null,
          total: mark.total ?? null,
          grade: mark.grade ?? null,
          uploadedById: facultyId,
        },
        create: {
          studentId: student.id,
          subjectCode,
          subjectName,
          semester,
          internal1: mark.internal1 ?? null,
          internal2: mark.internal2 ?? null,
          internal3: mark.internal3 ?? null,
          assignment: mark.assignment ?? null,
          exam: mark.exam ?? null,
          total: mark.total ?? null,
          grade: mark.grade ?? null,
          uploadedById: facultyId,
        },
      })
      results.push(upserted)
    }

    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('Marks upload error:', error)
    return NextResponse.json({ error: 'Failed to upload marks' }, { status: 500 })
  }
}

// GET /api/faculty/marks?subjectCode=CS301&semester=I&sectionId=y1a
export async function GET(request: Request) {
  const { error } = await requireAuth(["faculty", "admin"])
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const subjectCode = searchParams.get('subjectCode')
    const semester = searchParams.get('semester')

    if (!subjectCode || !semester) {
      return NextResponse.json({ error: 'subjectCode and semester required' }, { status: 400 })
    }

    const marks = await prisma.subjectMark.findMany({
      where: { subjectCode, semester },
      include: { student: { select: { name: true, rollNo: true, slug: true } } },
      orderBy: { student: { rollNo: 'asc' } },
    })

    return NextResponse.json(marks)
  } catch (error) {
    console.error('Marks fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch marks' }, { status: 500 })
  }
}
