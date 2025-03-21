import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    if (!token) {
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

// Update the matcher to include all protected routes
export const config = {
  matcher: [
    '/courses/:path*',
    '/profile/:path*',
    '/learning-paths/:path*',
    '/challenges/:path*',
    '/dashboard/:path*'
  ]
}; 