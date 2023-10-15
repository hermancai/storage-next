"use client";

import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";

export default function Navbar() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const user = useGetUser();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="flex justify-between items-center">
            <Link href="/">Home</Link>
            <div className="flex gap-8">
                {user !== null ? (
                    <>
                        <p>Hello, {user.user_metadata.name}</p>
                        <Link href="/account">Account</Link>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </>
                ) : (
                    <>
                        <Link href="/signup">Sign Up</Link>
                        <Link href="/login">Log In</Link>
                    </>
                )}
            </div>
        </div>
    );
}
