import { NextResponse } from 'next/server'
import { getSectionDetail } from '@/lib/queries'
import { requireAuth } from "@/lib/auth-helpers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  const { error } = await requireAuth(["admin", "faculty"])
  if (error) return error

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
