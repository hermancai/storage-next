"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useRedirectIfAuthorized from "@/hooks/useRedirectIfAuthorized";

export default function SignupPage() {
    const [loading, setLoading] = useState(true);
    useRedirectIfAuthorized(setLoading);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        const signUpResponse = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
                // redirect user after verifying email
                emailRedirectTo: `${location.origin}/api/signup`,
            },
        });
        if (signUpResponse.error === null) {
            setSuccess(true);
        }
        router.refresh();
    };

    if (loading) {
        return <div>LOADING</div>;
    }

    return (
        <>
            {success ? (
                <div>
                    Please check your email for verification. This page can be
                    closed.
                </div>
            ) : (
                <div>
                    <form onSubmit={handleSignUp}>
                        <div>
                            <label htmlFor="email">email</label>
                            <input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="name">name</label>
                            <input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                        <button onClick={handleSignUp}>Sign Up</button>
                    </form>
                </div>
            )}
        </>
    );
}
