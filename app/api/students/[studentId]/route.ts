import { NextResponse } from 'next/server'
import { getStudentProfile } from '@/lib/queries'
import { requireAuth } from "@/lib/auth-helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { error, session } = await requireAuth(["student", "admin", "faculty"])
  if (error) return error

  const { studentId } = await params

  // Students can only access their own data
  if (session!.user.role === "student" && session!.user.studentId !== studentId) {
    return NextResponse.json(
      { error: "Forbidden - You can only access your own profile" },
      { status: 403 }
    )
  }

  try {
    const data = await getStudentProfile(studentId)
    if (!data) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Student API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student data' },
      { status: 500 }
    )
  }
}
