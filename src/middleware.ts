import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect the /admin route with a simple secret token in the cookie
    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get("admin_token")?.value;
        const secret = process.env.ADMIN_SECRET;

        if (!secret || token !== secret) {
            // Redirect to login page if not authenticated
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
