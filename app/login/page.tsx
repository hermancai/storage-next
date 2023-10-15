"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import useRedirectIfAuthorized from "@/hooks/useRedirectIfAuthorized";

export default function LoginPage() {
    const [loading, setLoading] = useState(true);
    useRedirectIfAuthorized(setLoading);
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return console.log(error);
        }
        router.push("/home");
    };

    if (loading) {
        return <div>LOADING</div>;
    }

    return (
        <div>
            Login page
            <div>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">email</label>
                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    );
}
