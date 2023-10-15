"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

export default function useRedirectIfAuthorized(
    setLoading: Dispatch<SetStateAction<boolean>>
) {
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        const redirectIfAuthorized = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session) {
                router.push("/home");
            }
        };
        redirectIfAuthorized();
        setLoading(false);
    }, [supabase]);
}
