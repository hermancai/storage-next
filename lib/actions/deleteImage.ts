"use server";

import s3Client from "@/lib/aws/s3Client";
import { normalizeError } from "@/lib/utility/normalizeError";
import { GeneralResponse } from "@/types/api";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function deleteImage(
    s3_id: string,
    currentPath: string
): Promise<GeneralResponse> {
    revalidatePath(currentPath);
    const supabase = createServerActionClient({ cookies: () => cookies() });

    // Check user session
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (session === null) {
        return { ok: false, error: "Failed to get user session." };
    }

    // Remove from S3
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: s3_id,
        });
        await s3Client.send(command);
    } catch (error) {
        return { ok: false, error: normalizeError(error) };
    }

    // Remove from Supabase
    const { error } = await supabase.from("image").delete().eq("s3_id", s3_id);
    if (error) {
        return { ok: false, error: normalizeError(error) };
    }

    return { ok: true };
}
