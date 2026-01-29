"use server";

import s3Client from "@/lib/aws/s3Client";
import { normalizeError } from "@/lib/utility/normalizeError";
import { PresignedUrlResponse } from "@/types/api";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";

export default async function getPresignedUrl(
    fileType: string
): Promise<PresignedUrlResponse> {
    const s3_id = uuidv4() + "." + fileType;

    try {
        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: process.env.BUCKET_NAME!,
            Key: s3_id,
            Fields: { acl: "private", "Content-Type": "image/" + fileType },
            Conditions: [["starts-with", "$Content-Type", "image/"]],
        });
        return { ok: true, presignedUrl: url, fields, s3_id };
    } catch (err) {
        return { ok: false, error: normalizeError(err) };
    }
}
