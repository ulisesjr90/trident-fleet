import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { JWT } from "next-auth/jwt"

// Debug logging function
function debugLog(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware Debug] ${message}`, data ? data : '')
  }
}

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/error', '/api/auth']

// Define authentication paths
const AUTH_PATHS = ['/']

// Define route configurations
type RouteConfig = {
  path: string
  roles?: string[]
}

const ROUTES: RouteConfig[] = [
  { path: '/dashboard', roles: ['rep', 'admin'] },
  { path: '/users', roles: ['admin'] },
  { path: '/fleet', roles: ['rep', 'admin'] },
  { path: '/maintenance', roles: ['rep', 'admin'] },
  { path: '/reports', roles: ['rep', 'admin'] },
  { path: '/settings', roles: ['rep', 'admin'] },
]

// Helper function to check if path is public
function isPublicPath(path: string): boolean {
  debugLog('Checking if path is public:', { path })
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))
}

// Helper function to check if path is auth path
function isAuthPath(path: string): boolean {
  debugLog('Checking if path is auth path:', { path })
  return AUTH_PATHS.some(authPath => path.startsWith(authPath))
}

// Helper function to get route configuration
function getRouteConfig(path: string): RouteConfig | undefined {
  debugLog('Getting route config for path:', { path })
  return ROUTES.find(route => path.startsWith(route.path))
}

// Helper function to check if user has required role
function hasRequiredRole(userRole: string | undefined, requiredRoles: string[] | undefined): boolean {
  debugLog('Checking user role:', { userRole, requiredRoles })
  if (!requiredRoles) return true
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token?: JWT } }) {
    debugLog('Middleware called for path:', { path: req.nextUrl.pathname })
    
    const token = req.nextauth?.token
    debugLog('Token in middleware:', { 
      hasToken: !!token,
      tokenData: token ? {
        id: token.id,
        role: token.role,
        exp: token.exp
      } : null
    })

    // Allow public paths
    if (isPublicPath(req.nextUrl.pathname)) {
      debugLog('Path is public, allowing access')
      return NextResponse.next()
    }

    // Handle authentication paths
    if (isAuthPath(req.nextUrl.pathname)) {
      debugLog('Path is auth path, checking authentication')
      if (!token) {
        debugLog('No token found, redirecting to login')
        return NextResponse.redirect(new URL('/', req.url))
      }
      debugLog('Token found, allowing access to auth path')
      return NextResponse.next()
    }

    // Get route configuration
    const routeConfig = getRouteConfig(req.nextUrl.pathname)
    debugLog('Route config:', routeConfig)

    // Check if route requires specific role
    if (routeConfig?.roles) {
      debugLog('Route requires roles:', routeConfig.roles)
      if (!hasRequiredRole(token?.role as string, routeConfig.roles)) {
        debugLog('User does not have required role, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      debugLog('User has required role, allowing access')
    }

    debugLog('Middleware completed successfully')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        debugLog('Authorized callback called with token:', { 
          hasToken: !!token,
          tokenData: token ? {
            id: token.id,
            role: token.role,
            exp: token.exp
          } : null
        })
        return !!token
      },
    },
    pages: {
      signIn: '/',
    },
  }
)

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 