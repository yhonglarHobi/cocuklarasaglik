import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Eğer kullanıcı /admin sayfalarına girmeye çalışıyorsa
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Login sayfasına girmeye çalışıyorsa engelleme
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Cookie kontrolü yap (admin_session var mı?)
        const hasSession = request.cookies.has('admin_session');

        if (!hasSession) {
            // Giriş yapmamışsa login sayfasına yönlendir
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

// Hangi sayfalarda çalışacağını belirle
export const config = {
    matcher: '/admin/:path*',
}
