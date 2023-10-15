import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

export default function useGetUser() {
    const supabase = createClientComponentClient();
    const [user, setUser] = useState<User | null>(null);

    const getUpdatedUser = useCallback(async () => {
        const sessionRes = await supabase.auth.getSession();
        if (sessionRes.error || !sessionRes.data.session) {
            setUser(null);
            return;
        }

        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    }, [supabase]);

    useEffect(() => {
        getUpdatedUser();
    }, [getUpdatedUser]);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // Get user data from database because stored session is stale
                if (event === "USER_UPDATED") {
                    getUpdatedUser();
                    return;
                }

                // Handle case where SIGNED_IN triggers on window focus
                if (session && user?.id === session.user.id) {
                    return;
                }

                // This should only run the first time SIGNED_IN triggers
                if (
                    session &&
                    (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
                ) {
                    setUser(session.user);
                    return;
                }

                if (event === "SIGNED_OUT") {
                    setUser(null);
                    return;
                }
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase, user, getUpdatedUser]);

    return user;
}
