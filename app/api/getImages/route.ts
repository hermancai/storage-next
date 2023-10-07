import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import s3Client from "../s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
    const { folderId } = await req.json();

    const supabase = createRouteHandlerClient({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (session === null) {
        return NextResponse.json({ error: "Failed to get user session." });
    }

    // Get image IDs from supabase
    const getImagesResponse = await supabase
        .from("image")
        .select("s3_id, name")
        .eq("folder_id", folderId);
    if (getImagesResponse.error) {
        return NextResponse.json({ error: getImagesResponse.error });
    }

    try {
        // Request presigned URLs from AWS for each image thumbnail
        for (const image of getImagesResponse.data) {
            const command = new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME! + "-resized",
                Key: image.s3_id,
                ResponseContentDisposition: `inline; filename="${encodeURIComponent(
                    image.name
                )}"`,
            });
            // presigned URL expires in 24 hours
            const presignedUrl = await getSignedUrl(s3Client, command, {
                expiresIn: 86400,
            });
            (image as any).presignedUrl = presignedUrl;
        }

        return NextResponse.json({ images: getImagesResponse.data });
    } catch (error) {
        NextResponse.json({ error });
    }
}
