import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CreateFolderResponse } from "@/types/api";
import { normalizeError } from "@/lib/utility/normalizeError";
import revalidatePathAction from "@/lib/actions/revalidatePathAction";

export default async function createFolder(
    parent: string,
    name: string,
    currentPath: string
): Promise<CreateFolderResponse> {
    const supabase = createClientComponentClient();

    const res = await supabase
        .from("folder")
        .insert({ parent, name })
        .select("id, name");
    if (res.error) {
        return { ok: false, error: normalizeError(res.error) };
    }

    revalidatePathAction(currentPath);
    return { ok: true, ...res.data[0] };
}
