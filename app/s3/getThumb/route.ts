import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import s3Client from "../s3Client";

export async function POST(req: Request) {
    const { s3_id, name } = await req.json();
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME! + "-resized",
            Key: s3_id,
            ResponseContentDisposition: `inline; filename="${encodeURIComponent(
                name
            )}"`,
        });
        return NextResponse.json({
            presignedUrl: await getSignedUrl(s3Client, command, {
                expiresIn: 86400,
            }),
        });
    } catch (error) {
        return NextResponse.json({ error });
    }
}
