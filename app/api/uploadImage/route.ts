import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";
import s3Client from "../s3Client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { fileType } = await req.json();
    const s3_id = uuidv4() + "." + fileType;

    try {
        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: process.env.BUCKET_NAME!,
            Key: s3_id,
            Fields: { acl: "private", "Content-Type": "image/" + fileType },
            Conditions: [["starts-with", "$Content-Type", "image/"]],
        });
        return NextResponse.json({
            url,
            fields,
            s3_id,
        });
    } catch (err) {
        return NextResponse.json({
            error: "Requesting presigned URL from AWS failed.",
        });
    }
}
