import React from 'react'
import { getAdminDashboardData } from '@/lib/queries'
import AdminContent from './AdminContent'

export default async function CseAdminPage() {
  const data = await getAdminDashboardData()
  return <AdminContent years={data.years} documents={data.documents} events={data.events} />
}
