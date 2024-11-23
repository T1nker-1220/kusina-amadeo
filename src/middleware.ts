import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.email?.includes("kusinadeamadeo@gmail.com");
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*"],
};
