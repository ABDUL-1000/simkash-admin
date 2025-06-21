import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const cookieHeader = request.headers.get("cookie") ?? ""

  // Parse cookies from the header
  const cookies: Record<string, string> = Object.fromEntries(
    cookieHeader
      .split("; ")
      .map((c: string): [string, string] | null => {
        const [name, ...rest] = c.split("=")
        if (name) {
          return [name, rest.join("=")]
        }
        return null
      })
      .filter((entry): entry is [string, string] => entry !== null),
  )

  const accessToken = cookies.access_token

  // Protected routes - require authentication
  const protectedRoutes = ["/dashboard", "/settings", "/account"]

  // Public routes - redirect to dashboard if already authenticated
  const publicRoutes = ["/login", "/signup", "/verify-otp", "/forgotpassword", "/reset-password"]

  // Special route that doesn't require full authentication but needs temp access
  const profileCompletionRoutes = ["/profilesetting"]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isProfileCompletionRoute = profileCompletionRoutes.some((route) => pathname.startsWith(route))

  // Handle profile completion route - allow access without permanent token
  if (isProfileCompletionRoute) {
    // Allow access to profile settings regardless of token status
    // The profile completion logic will handle authentication via sessionStorage
    return NextResponse.next()
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users from public routes to dashboard
  if (isPublicRoute && accessToken && !pathname.startsWith("/verify-otp") && !pathname.startsWith("/reset-password")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Special case: Redirect root path based on authentication status
  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/signup", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
