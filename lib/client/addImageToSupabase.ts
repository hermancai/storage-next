import { normalizeError } from "@/lib/utility/normalizeError";
import { InsertImageSupabaseResponse } from "@/types/api";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function addImageToSubabase(
    s3_id: string,
    fileName: string,
    folder_id: string
): Promise<InsertImageSupabaseResponse> {
    const supabase = createClientComponentClient();

    const res = await supabase
        .from("image")
        .insert({
            s3_id: s3_id,
            name: fileName,
            folder_id,
        })
        .select("s3_id, created_at");
    if (res.error) {
        return { ok: false, error: normalizeError(res.error) };
    }

    return { ok: true, ...res.data[0] };
}
