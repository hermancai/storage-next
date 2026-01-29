"use server";

import deleteFromS3Bucket from "@/lib/aws/deleteFromS3Bucket";
import { normalizeError } from "@/lib/utility/normalizeError";
import { GeneralResponse } from "@/types/api";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export default async function deleteAccount(): Promise<GeneralResponse> {
    // Admin perms required for deleting user
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check user session
    const routeSupabase = createServerActionClient({
        cookies: () => cookies(),
    });
    const {
        data: { session },
    } = await routeSupabase.auth.getSession();
    if (session === null) {
        return { ok: false, error: "Failed to get user session." };
    }

    // Get user images from supabase
    const imagesRes = await routeSupabase
        .from("image")
        .select("s3_id")
        .eq("user_id", session.user.id);
    if (imagesRes.error) {
        return { ok: false, error: normalizeError(imagesRes.error) };
    }

    // Delete all images belonging to user in S3
    try {
        await deleteFromS3Bucket(imagesRes.data);
    } catch (err) {
        return { ok: false, error: normalizeError(err) };
    }

    // Remove cookies from client
    const signOutRes = await routeSupabase.auth.signOut();
    if (signOutRes.error) {
        return { ok: false, error: normalizeError(signOutRes.error) };
    }

    // Delete user using admin perms
    const { error } = await adminSupabase.auth.admin.deleteUser(
        session.user.id
    );
    if (error) {
        return { ok: false, error: normalizeError(error) };
    }

    return { ok: true };
}
