import React from 'react'
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getAdminDashboardData } from '@/lib/queries'
import AdminContent from './AdminContent'

export default async function CseAdminPage() {
  const session = await auth()

  // Require authentication and admin role
  if (!session || session.user.role !== "admin") {
    redirect("/Login/admin")
  }

  const data = await getAdminDashboardData()
  return <AdminContent years={data.years} documents={data.documents} events={data.events} />
}
