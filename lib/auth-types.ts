import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "faculty" | "student"
      facultyId: string | null
      studentId: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    facultyId: string | null
    studentId: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    facultyId: string | null
    studentId: string | null
  }
}
