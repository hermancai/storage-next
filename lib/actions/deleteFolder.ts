"use server";

import deleteFromS3Bucket from "@/lib/aws/deleteFromS3Bucket";
import { normalizeError } from "@/lib/utility/normalizeError";
import { GeneralResponse } from "@/types/api";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function deleteFolder(
    id: string,
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

    // Data is list of image s3_id
    const imagesRes = await supabase.rpc("get_nested_images", { f_id: id });

    // Delete images from S3
    try {
        await deleteFromS3Bucket(imagesRes.data);
    } catch (err) {
        return { ok: false, error: normalizeError(err) };
    }

    // Delete folder from supabase
    // Cascade delete will handle nested folders and images
    const folderRes = await supabase.from("folder").delete().eq("id", id);
    if (folderRes.error) {
        return { ok: false, error: normalizeError(folderRes.error) };
    }

    return { ok: true };
}
