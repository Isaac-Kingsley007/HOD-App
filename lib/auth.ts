import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) return null

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          facultyId: user.facultyId,
          studentId: user.studentId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.facultyId = user.facultyId
        token.studentId = user.studentId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.facultyId = token.facultyId as string | null
        session.user.studentId = token.studentId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/Login/student",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
})
