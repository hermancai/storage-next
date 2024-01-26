import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // getSession() will refresh the session if expired
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const path = req.nextUrl.pathname;
    // Redirect authorized user for pages (landing, login, signup)
    if (session) {
        if (
            path === "/" ||
            path.startsWith("/login") ||
            path.startsWith("/signup")
        ) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
        return res;
    }

    // Redirect unauthorized user for pages (home, account)
    if (!session) {
        if (path.startsWith("/home") || path.startsWith("/account")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return res;
    }
}
