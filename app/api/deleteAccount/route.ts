import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import deleteFromS3Bucket from "../deleteFromS3Bucket";

export async function POST(req: Request) {
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get current user based on cookie
    const routeSupabase = createRouteHandlerClient({ cookies });
    const sessionResponse = await routeSupabase.auth.getSession();
    if (sessionResponse.error) {
        return NextResponse.json(
            { error: sessionResponse.error },
            { status: 400 }
        );
    }
    if (sessionResponse.data.session === null) {
        return NextResponse.json(
            { error: "User session not found." },
            { status: 400 }
        );
    }

    // Get user images from supabase
    const imagesRes = await routeSupabase
        .from("image")
        .select("s3_id")
        .eq("user_id", sessionResponse.data.session.user.id);
    if (imagesRes.error) {
        return NextResponse.json({ error: imagesRes.error }, { status: 500 });
    }

    // Delete all images belonging to user in S3
    try {
        await deleteFromS3Bucket(imagesRes.data);
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }

    // Remove cookie
    const signOutResponse = await routeSupabase.auth.signOut();
    if (signOutResponse.error) {
        return NextResponse.json(
            { error: signOutResponse.error },
            { status: 500 }
        );
    }

    // Delete user using admin perms
    const { error } = await adminSupabase.auth.admin.deleteUser(
        sessionResponse.data.session.user.id
    );
    if (error !== null) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted successfully." });
}
