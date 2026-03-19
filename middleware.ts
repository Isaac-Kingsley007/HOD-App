import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Public routes - anyone can access
  const publicRoutes = ["/", "/Login", "/Signup"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If accessing public route
  if (isPublicRoute) {
    // If logged in and trying to access login/signup, redirect to dashboard
    if (session && (pathname.includes("/Login") || pathname.includes("/Signup"))) {
      const role = session.user.role
      const dashboardPath = `/Dashboard/${role.charAt(0).toUpperCase() + role.slice(1)}`
      return NextResponse.redirect(new URL(dashboardPath, request.url))
    }
    return NextResponse.next()
  }

  // Protected routes - require authentication
  if (!session) {
    const loginUrl = new URL("/Login/student", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control
  const role = session.user.role
  const allowedDashboard = `/Dashboard/${role.charAt(0).toUpperCase() + role.slice(1)}`

  if (pathname.startsWith("/Dashboard") && !pathname.startsWith(allowedDashboard)) {
    return NextResponse.redirect(new URL(allowedDashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|generated).*)",
  ],
}
