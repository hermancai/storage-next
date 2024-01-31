import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const res = await adminSupabase.auth.admin.listUsers({ perPage: 1 });

    if (res.error) {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }

    return NextResponse.json({ status: "ok" });
}
