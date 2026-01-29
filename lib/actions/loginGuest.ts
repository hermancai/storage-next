"use server";

import { normalizeError } from "@/lib/utility/normalizeError";
import { GeneralResponse } from "@/types/api";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function loginGuest(): Promise<GeneralResponse> {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL!;
    const password = process.env.GUEST_PASSWORD!;

    const supabase = createServerActionClient({ cookies: () => cookies() });
    const loginRes = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (loginRes.error) {
        return { ok: false, error: normalizeError(loginRes.error) };
    }

    return { ok: true };
}
