import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function changeUsername(name: string) {
    const supabase = createClientComponentClient();

    return await supabase.auth.updateUser({
        data: { name },
    });
}
