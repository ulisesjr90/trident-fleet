import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/error', '/api/auth']

// Define route configurations
type RouteConfig = {
  path: string
  roles?: string[]
}

// Helper function to check if path is public
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))
}

// Helper function to get route configuration
function getRouteConfig(path: string): RouteConfig | undefined {
  // Add your route configurations here
  return undefined
}

// Helper function to check if user has required role
function hasRequiredRole(userRole: string | undefined, requiredRoles: string[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value
  const path = request.nextUrl.pathname

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (authToken && path === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow public paths
  if (isPublicPath(path)) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (!authToken) {
    // Store the original URL to redirect back after login
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('redirect-url', request.url, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5 // 5 minutes
    })
    return response
  }

  // Get route configuration
  const routeConfig = getRouteConfig(path)

  // Check if route requires specific role
  if (routeConfig?.roles) {
    const userRole = request.cookies.get('user-role')?.value
    if (!hasRequiredRole(userRole, routeConfig.roles)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 