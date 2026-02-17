import { NextResponse } from 'next/server'
import { getStudentProfile } from '@/lib/queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
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
