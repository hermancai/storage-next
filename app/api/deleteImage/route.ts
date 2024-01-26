import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../s3Client";

export async function POST(req: Request) {
    const { s3_id } = await req.json();
    if (!s3_id) {
        return NextResponse.json({ error: "Missing image ID." });
    }

    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: s3_id,
        });
        await s3Client.send(command);
    } catch (error) {
        return NextResponse.json({ error });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (session === null) {
        return NextResponse.json({ error: "Failed to get user session." });
    }

    const { error } = await supabase.from("image").delete().eq("s3_id", s3_id);
    if (error) {
        return NextResponse.json({ error });
    }

    return NextResponse.json({ message: "Deleted image." });
}
