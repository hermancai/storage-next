import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function changePassword(
    current_plain_password: string,
    new_plain_password: string
) {
    const supabase = createClientComponentClient();

    return await supabase.rpc("change_user_password", {
        current_plain_password,
        new_plain_password,
    });
}
