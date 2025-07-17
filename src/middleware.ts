import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get session from Better Auth
    const session = await auth.api.getSession({
        headers: request.headers
    });

    // Define route patterns
    const isAuthPage = pathname.startsWith('/login') || 
                      pathname.startsWith('/register') || 
                      pathname.startsWith('/forgot-password') || 
                      pathname.startsWith('/reset-password') || 
                      pathname.startsWith('/verify-email');
    
    const isDashboardPage = pathname.startsWith('/account') || pathname.startsWith('/admin');
    const isAdminPage = pathname.startsWith('/admin');
    const isBannedPage = pathname === '/banned';

    // Handle banned users - redirect to banned page unless already there
    if (session?.user?.banned && !isBannedPage) {
        return NextResponse.redirect(new URL('/banned', request.url));
    }

    // Prevent banned users from accessing any other pages
    if (session?.user?.banned && !isBannedPage) {
        return NextResponse.redirect(new URL('/banned', request.url));
    }

    // If user is authenticated and trying to access auth pages, redirect to appropriate dashboard
    if (session && isAuthPage && !session.user.banned) {
        // Check if user is admin for redirect
        const isAdmin = session.user.role === 'admin' || 
                       (Array.isArray(session.user.role) && session.user.role.includes('admin'));
        const redirectUrl = isAdmin ? '/admin' : '/account';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // If user is not authenticated and trying to access protected pages
    if (!session && isDashboardPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin role check - prevent non-admin users from accessing admin pages
    if (session && isAdminPage && !session.user.banned) {
        const isAdmin = session.user.role === 'admin' || 
                       (Array.isArray(session.user.role) && session.user.role.includes('admin'));
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    // Email verification check - redirect unverified users to verification page
    if (session && !session.user.emailVerified && isDashboardPage && pathname !== '/verify-email') {
        return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // Prevent verified users from accessing verify-email page
    if (session && session.user.emailVerified && pathname === '/verify-email') {
        const isAdmin = session.user.role === 'admin' || 
                       (Array.isArray(session.user.role) && session.user.role.includes('admin'));
        const redirectUrl = isAdmin ? '/admin' : '/account';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Auth pages
        '/login',
        '/register', 
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/banned',
        // Protected pages
        '/account/:path*',
        '/admin/:path*'
    ],
};