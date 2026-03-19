import { NextResponse } from 'next/server'
import { getAdminDashboardData } from '@/lib/queries'
import { requireAuth } from "@/lib/auth-helpers"

export async function GET() {
  const { error, session } = await requireAuth(["admin"])
  if (error) return error

  try {
    const data = await getAdminDashboardData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    )
  }
}
