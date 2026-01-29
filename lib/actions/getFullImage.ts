"use server";

import s3Client from "@/lib/aws/s3Client";
import { normalizeError } from "@/lib/utility/normalizeError";
import { ImageUrlResponse } from "@/types/api";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function getFullImage(
    s3_id: string,
    name: string
): Promise<ImageUrlResponse> {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: s3_id,
            ResponseContentDisposition: `attachment; filename="${encodeURIComponent(
                name
            )}"`,
        });
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 86400,
        });
        return { ok: true, signedUrl };
    } catch (err) {
        return { ok: false, error: normalizeError(err) };
    }
}
