import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from "@/lib/auth-helpers"

export async function GET() {
  const { error } = await requireAuth() // Any authenticated user
  if (error) return error

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
  const { error, session } = await requireAuth(["admin"])
  if (error) return error

  try {
    const body = await request.json()
    const { title, content, target } = body

    if (!title || !content || !target) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        target,
        postedBy: session!.user.name,
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('Announcement create error:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
