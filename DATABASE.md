# Database Implementation Guide

This document describes how Prisma + Neon DB is used to fetch data for the Admin, Section, and Student pages.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HOD App - Data Flow                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Pages (Server Components)     lib/queries.ts         Prisma + Neon DB   │
│  ─────────────────────────    ─────────────         ───────────────    │
│                                                                         │
│  /Dashboard/Admin        ──►  getAdminDashboardData()  ──►  Year,      │
│  (years, documents,           (years, documents,           Section,     │
│   events)                      events)                    Document,    │
│                                                           Event        │
│                                                                         │
│  /Dashboard/Admin/       ──►  getSectionDetail()     ──►  Section,     │
│  section/[sectionId]         (sectionId)                 Student,      │
│  (students, faculty,                                         Faculty,   │
│   subjects)                                                 Subject    │
│                                                                         │
│  /Dashboard/Admin/       ──►  getStudentProfile()     ──►  Student,     │
│  student/[studentId]         (studentSlug)               Marks,       │
│  (profile, marks,                                            Certs,     │
│   certifications,                                            Projects   │
│   projects)                                                  Attendance  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
prisma/
├── schema.prisma      # Database models (Year, Section, Student, Faculty, etc.)
└── seed.ts            # Seed script for sample data

lib/
├── db.ts              # Prisma client singleton
└── queries.ts         # Server-side data fetching functions

app/
├── api/
│   ├── admin/route.ts           # GET /api/admin
│   ├── sections/[sectionId]/   # GET /api/sections/:sectionId
│   └── students/[studentId]/    # GET /api/students/:studentId
└── Dashboard/Admin/
    ├── page.tsx                 # Server component → fetches years, docs, events
    ├── AdminContent.tsx         # Client component (receives data as props)
    ├── section/[sectionId]/
    │   ├── page.tsx             # Server component → fetches section detail
    │   └── SectionContent.tsx   # Client component (receives data as props)
    └── student/[studentId]/
        └── page.tsx             # Server component → fetches student profile
```

## Setup Instructions

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection strings:
   - **Pooled** (for `DATABASE_URL`): `postgresql://...@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
   - **Direct** (for `DIRECT_URL`): `postgresql://...@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - Note: Pooled has `-pooler` in host; Direct does not

### 2. Environment Variables

Create `.env` in project root:

```env
DATABASE_URL="postgresql://user:password@ep-xxxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
```

For local PostgreSQL, use the same URL for both variables.

### 3. Initialize Database

```bash
# Install dependencies (if not done)
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or use migrations for production
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Run the App

```bash
npm run dev
```

Visit:
- http://localhost:3000/Dashboard/Admin
- http://localhost:3000/Dashboard/Admin/section/y1a
- http://localhost:3000/Dashboard/Admin/student/y1a-s1

## Data Models

| Model | Purpose |
|-------|---------|
| **Year** | I Year, II Year, III Year, IV Year |
| **Section** | y1a, y1b, y2a, etc. – belongs to Year, has Class Advisor |
| **Student** | Belongs to Section, has slug (y1a-s1) for URL |
| **Faculty** | Class advisors and subject teachers |
| **Subject** | Course definitions (code, name, credits) |
| **SectionSubject** | Links Section + Subject + Faculty (who teaches) |
| **StudentMark** | Semester-wise marks |
| **StudentCertification** | Certifications |
| **StudentProject** | Projects |
| **StudentAttendance** | Attendance % per semester |
| **Document** | Admin documents |
| **Event** | Department events |

## API Routes

- `GET /api/admin` – Years, documents, events
- `GET /api/sections/:sectionId` – Section detail (students, faculty, subjects)
- `GET /api/students/:studentId` – Student profile (studentId = slug, e.g. y1a-s1)

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB (no migration files) |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
