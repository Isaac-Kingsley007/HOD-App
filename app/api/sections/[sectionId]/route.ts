import { NextResponse } from 'next/server'
import { getSectionDetail } from '@/lib/queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await params
    const data = await getSectionDetail(sectionId)
    if (!data) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Section API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section data' },
      { status: 500 }
    )
  }
}
