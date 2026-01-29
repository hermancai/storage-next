import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GeneralResponse } from "@/types/api";
import { normalizeError } from "@/lib/utility/normalizeError";
import revalidatePathAction from "@/lib/actions/revalidatePathAction";

export default async function renameFolder(
    id: string,
    name: string,
    currentPath: string
): Promise<GeneralResponse> {
    const supabase = createClientComponentClient();

    const res = await supabase.from("folder").update({ name }).eq("id", id);
    if (res.error) {
        return { ok: false, error: normalizeError(res.error) };
    }

    revalidatePathAction(currentPath);
    return { ok: true };
}
