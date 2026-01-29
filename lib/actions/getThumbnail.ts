"use server";

import { getThumbnailUrl } from "@/lib/aws/getThumbnailUrl";
import { normalizeError } from "@/lib/utility/normalizeError";
import { ImageUrlResponse } from "@/types/api";

export default async function getThumbnail(
    s3_id: string,
    name: string
): Promise<ImageUrlResponse> {
    try {
        const signedUrl = await getThumbnailUrl(s3_id, name);
        return { ok: true, signedUrl };
    } catch (error) {
        return { ok: false, error: normalizeError(error) };
    }
}
