import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GeneralResponse } from "@/types/api";
import { normalizeError } from "@/lib/utility/normalizeError";
import revalidatePathAction from "@/lib/actions/revalidatePathAction";

export default async function renameImage(
    s3_id: string,
    newName: string,
    currentPath: string
): Promise<GeneralResponse> {
    const supabase = createClientComponentClient();

    // Rename image in Supabase
    const res = await supabase
        .from("image")
        .update({ name: newName })
        .eq("s3_id", s3_id);

    if (res.error) {
        return { ok: false, error: normalizeError(res.error) };
    }

    revalidatePathAction(currentPath);
    return { ok: true };
}
