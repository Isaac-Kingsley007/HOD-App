import { NextResponse } from 'next/server'
import { getFacultyDashboardData } from '@/lib/queries'
import { requireAuth } from "@/lib/auth-helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  const { error, session } = await requireAuth(["admin", "faculty"])
  if (error) return error

  const { facultyId } = await params

  // Faculty can only access their own data
  if (session!.user.role === "faculty" && session!.user.facultyId !== facultyId) {
    return NextResponse.json(
      { error: "Forbidden - You can only access your own profile" },
      { status: 403 }
    )
  }

  try {
    const data = await getFacultyDashboardData(facultyId)
    if (!data) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Faculty API error:', error)
    return NextResponse.json({ error: 'Failed to fetch faculty data' }, { status: 500 })
  }
}
