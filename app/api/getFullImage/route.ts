import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import s3Client from "../s3Client";

export async function POST(req: Request) {
    const { s3_id, name } = await req.json();

    if (!s3_id || !name) {
        return NextResponse.json(
            { error: "Missing s3_id or name." },
            { status: 400 }
        );
    }

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: s3_id,
            ResponseContentDisposition: `attachment; filename="${encodeURIComponent(
                name
            )}"`,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 86400 });
        return NextResponse.json({ url });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });
    }
}
