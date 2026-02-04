import { NextResponse } from 'next/server'

// Simple dummy API route returning students and faculty assignments for a section
export async function GET(request: Request, { params }: { params: { sectionId: string }}) {
  const { sectionId } = params

  // Generate some dummy students based on sectionId
  const students = Array.from({ length: 8 }).map((_, i) => ({
    id: `${sectionId}-s${i+1}`,
    name: `Student ${i+1}`,
    rollNo: `${sectionId.toUpperCase()}${100 + i}`,
    year: sectionId.startsWith('y1') ? 'I Year' : sectionId.startsWith('y2') ? 'II Year' : sectionId.startsWith('y3') ? 'III Year' : 'IV Year',
    section: sectionId.endsWith('a') ? 'CSE A' : 'CSE B',
  }))

  const assignments = [
    { facultyId: 'f1', facultyName: 'Dr. N. Gupta', subjectCode: 'CS301', subjectName: 'Operating Systems' },
    { facultyId: 'f2', facultyName: 'Dr. P. Joshi', subjectCode: 'CS302', subjectName: 'Database Systems' },
  ]

  return NextResponse.json({ students, assignments })
}
