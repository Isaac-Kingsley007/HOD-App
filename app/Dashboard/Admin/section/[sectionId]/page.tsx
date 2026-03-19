import React from 'react'
import { notFound } from 'next/navigation'
import { getSectionDetail } from '@/lib/queries'
import SectionContent from './SectionContent'

export default async function SectionDetailPage({
  params,
}: {
  params: Promise<{ sectionId: string }>
}) {
  const { sectionId } = await params
  const data = await getSectionDetail(sectionId)
  if (!data) return notFound()

  return <SectionContent data={data} />
}
