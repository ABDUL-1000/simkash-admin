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

  // Get the access token (matching the cookie name from AuthAPI)
  const accessToken = cookies.access_token
  console.log("Middleware - Access token:", accessToken ? "Present" : "Not found")
  console.log("Middleware - Current pathname:", pathname)
  console.log("Middleware - All cookies:", Object.keys(cookies))

  // Protected routes - require authentication
  const protectedRoutes = ["/dashboard", "/profile-setup", "/settings", "/account"]

  // Public routes - redirect to dashboard if already authenticated
  const publicRoutes = ["/login", "/signup", "/verify-otp", "/forgot-password", "/reset-password"]

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !accessToken) {
    console.log("Middleware - No token found for protected route, redirecting to login...")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users from public routes to dashboard
  // Exception: Allow access to verify-otp and reset-password even if authenticated
  if (isPublicRoute && accessToken && !pathname.startsWith("/verify-otp") && !pathname.startsWith("/reset-password")) {
    console.log("Middleware - Token found for public route, redirecting to dashboard...")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Special case: Redirect root path based on authentication status
  if (pathname === "/") {
    if (accessToken) {
      console.log("Middleware - Authenticated user on root, redirecting to dashboard...")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      console.log("Middleware - Unauthenticated user on root, redirecting to signup...")
      return NextResponse.redirect(new URL("/signup", request.url))
    }
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
