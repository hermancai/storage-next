import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function signInWithPassword(
    email: string,
    password: string
) {
    const supabase = createClientComponentClient();

    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
}
