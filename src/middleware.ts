import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  try {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    // If user is not authenticated and trying to access dashboard routes
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
      // Redirect to login page
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access auth pages
    if (session) {
      if (request.nextUrl.pathname === '/login') {
        // Redirect to dashboard
        const redirectUrl = new URL('/dashboard/usage', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  } catch (error) {
    // Silently continue on middleware errors
  }

  // Maintenance Mode
  const MAINTENANCE_PATHS = [
    '/dashboard/settings/team',
  ];

  if (MAINTENANCE_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};