import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { DeleteObjectsCommand, ObjectIdentifier } from "@aws-sdk/client-s3";
import s3Client from "../s3Client";

export async function POST(req: Request) {
    const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get current user based on cookie
    const routeSupabase = createRouteHandlerClient({ cookies });
    const sessionResponse = await routeSupabase.auth.getSession();
    if (sessionResponse.error !== null) {
        return NextResponse.json({ error: sessionResponse.error });
    }
    if (sessionResponse.data.session === null) {
        return NextResponse.json({ error: "User session not found." });
    }

    // Delete all images belonging to user in S3
    try {
        await deleteAllImages(
            routeSupabase,
            sessionResponse.data.session.user.id
        );
    } catch (err) {
        return NextResponse.json({ error: err });
    }

    // Remove cookie
    const signOutResponse = await routeSupabase.auth.signOut();
    if (signOutResponse.error) {
        return NextResponse.json({ error: signOutResponse.error });
    }

    // Delete user using admin perms
    const { data, error } = await adminSupabase.auth.admin.deleteUser(
        sessionResponse.data.session.user.id
    );
    if (error !== null) {
        return NextResponse.json({ error });
    }

    return NextResponse.json({ message: "User deleted successfully." });
}

async function deleteAllImages(supabase: SupabaseClient, userId: string) {
    const imagesRes = await supabase
        .from("image")
        .select("s3_id")
        .eq("user_id", userId);
    if (imagesRes.error) {
        throw Error(imagesRes.error.message);
    }

    if (imagesRes.data.length === 0) {
        return;
    }

    const imageKeys: ObjectIdentifier[] = [];
    for (const image of imagesRes.data) {
        imageKeys.push({ Key: image.s3_id });
    }

    // This command can handle at most 1000 keys
    const command = new DeleteObjectsCommand({
        Bucket: process.env.BUCKET_NAME!,
        Delete: { Objects: imageKeys },
    });

    const res = await s3Client.send(command);
    if (res.Errors) {
        console.log(res.Errors);
        throw new Error("Deleting from S3 failed.");
    }
}
