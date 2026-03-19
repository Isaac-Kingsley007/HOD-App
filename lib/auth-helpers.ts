import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function requireAuth(allowedRoles?: string[]) {
  const session = await auth()

  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      ),
      session: null,
    }
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      error: NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      ),
      session: null,
    }
  }

  return { error: null, session }
}
