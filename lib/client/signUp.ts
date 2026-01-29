import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function signUpSupabase(
    email: string,
    password: string,
    name: string
) {
    const supabase = createClientComponentClient();
    return await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });
}
