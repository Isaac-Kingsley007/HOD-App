import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// PUT /api/students/[studentId]/profile — update student profile
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    const body = await request.json()

    const student = await prisma.student.findUnique({ where: { slug: studentId } })
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const updated = await prisma.student.update({
      where: { slug: studentId },
      data: {
        name: body.name ?? undefined,
        phone: body.phone ?? undefined,
        address: body.address ?? undefined,
        imageUrl: body.imageUrl ?? undefined,
        dob: body.dob ? new Date(body.dob) : undefined,
        bloodGroup: body.bloodGroup ?? undefined,
        parentName: body.parentName ?? undefined,
        parentPhone: body.parentPhone ?? undefined,
        achievements: body.achievements ?? undefined,
      },
    })

    // Handle certifications - replace all
    if (body.certifications && Array.isArray(body.certifications)) {
      await prisma.studentCertification.deleteMany({ where: { studentId: student.id } })
      if (body.certifications.length > 0) {
        await prisma.studentCertification.createMany({
          data: body.certifications.map((c: { title: string; issuer: string; date: string }) => ({
            studentId: student.id,
            title: c.title,
            issuer: c.issuer,
            date: new Date(c.date),
          })),
        })
      }
    }

    // Handle projects - replace all
    if (body.projects && Array.isArray(body.projects)) {
      await prisma.studentProject.deleteMany({ where: { studentId: student.id } })
      if (body.projects.length > 0) {
        await prisma.studentProject.createMany({
          data: body.projects.map((p: { title: string; description: string; year: string }) => ({
            studentId: student.id,
            title: p.title,
            description: p.description,
            year: p.year,
          })),
        })
      }
    }

    return NextResponse.json({ success: true, slug: updated.slug })
  } catch (error) {
    console.error('Student profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
