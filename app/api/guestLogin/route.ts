import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL!;
    const password = process.env.GUEST_PASSWORD!;

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const loginResponse = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (loginResponse.error) {
        return NextResponse.json(
            { error: loginResponse.error },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}
