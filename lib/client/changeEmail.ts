import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function changeEmail(email: string) {
    const supabase = createClientComponentClient();

    return await supabase.auth.updateUser({
        email,
    });
}
