import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function verifyOtp(
    email: string,
    token: string,
    locationOrigin: string
) {
    const supabase = createClientComponentClient();

    return await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup",
        options: { redirectTo: `${locationOrigin}/home` },
    });
}
