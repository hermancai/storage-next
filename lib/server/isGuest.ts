import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function isGuest(): Promise<boolean> {
    const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL;

    const supabase = createServerComponentClient({
        cookies: () => cookies(),
    });

    const sessionRes = await supabase.auth.getSession();
    if (sessionRes.error) {
        return false;
    }

    if (sessionRes.data.session?.user.email === guestEmail) {
        return true;
    }

    return false;
}
