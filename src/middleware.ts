import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin but NOT /admin/login (which would cause infinite redirect loop)
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const token = request.cookies.get("admin_token")?.value;
        const secret = process.env.ADMIN_SECRET;

        // Only block if ADMIN_SECRET is set and token doesn't match
        if (secret && token !== secret) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Match /admin and all sub-paths EXCEPT /admin/login
    matcher: ["/admin", "/admin/(?!login$).*"],
};
