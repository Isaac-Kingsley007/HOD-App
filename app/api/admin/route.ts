import { NextResponse } from 'next/server'
import { getAdminDashboardData } from '@/lib/queries'

export async function GET() {
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
