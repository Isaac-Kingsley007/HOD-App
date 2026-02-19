import { NextResponse } from 'next/server'
import { getFacultyDashboardData } from '@/lib/queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ facultyId: string }> }
) {
  try {
    const { facultyId } = await params
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
