import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json(announcements)
  } catch (error) {
    console.error('Announcements error:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, target, postedBy } = body

    if (!title || !content || !target || !postedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const announcement = await prisma.announcement.create({
      data: { title, content, target, postedBy },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Announcement create error:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
