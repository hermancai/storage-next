import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function signOut() {
    const supabase = createClientComponentClient();

    return await supabase.auth.signOut();
}
