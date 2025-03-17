import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add paths that should be accessible only to logged-in users
    const protectedPaths = [
      '/courses',
      '/profile',
      '/learning-paths',
      '/challenges'
    ];

    const isProtectedPath = protectedPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    '/courses/:path*',
    '/profile/:path*',
    '/learning-paths/:path*',
    '/challenges/:path*'
  ]
}; 