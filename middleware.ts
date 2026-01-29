import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Middleware for protecting app routes (learning area)
 * Redirects unauthenticated users to /login with redirect parameter
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // Create Supabase client for auth check
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Check authentication status
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login with the original path as redirect parameter
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

/**
 * Matcher configuration for protected routes
 * All routes under the (app) route group are protected
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/dictionary/:path*',
    '/grammar/:path*',
    '/lesson/:path*',
    '/medical-reader/:path*',
    '/path/:path*',
    '/reader/:path*',
    '/srs/:path*',
  ],
}
