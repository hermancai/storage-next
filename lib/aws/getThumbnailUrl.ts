import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "@/lib/aws/s3Client";

export async function getThumbnailUrl(s3_id: string, name: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME! + "-resized",
        Key: s3_id,
        ResponseContentDisposition: `inline; filename="${encodeURIComponent(
            name
        )}"`,
        ResponseCacheControl: "public, max-age=86400, immutable",
    });
    return await getSignedUrl(s3Client, command, {
        expiresIn: 86400,
    });
}
