"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NonSSRWrapper from "@/components/shared/NonSSRWrapper";
import Footer from "@/components/shared/Footer";

export default function LoginPage() {
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [input, setInput] = useState({ email: "", password: "" });
    const [error, setError] = useState({
        email: "",
        password: "",
        login: "",
    });
    const [loginLoading, setLoginLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const validateInput = (): boolean => {
        let valid = true;

        if (!input.email.trim()) {
            valid = false;
            setError((prev) => {
                return {
                    ...prev,
                    email: "Please enter your email.",
                };
            });
        }

        if (!input.password) {
            valid = false;
            setError((prev) => {
                return { ...prev, password: "Please enter your password." };
            });
        }

        return valid;
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        setError({ email: "", password: "", login: "" });
        if (!validateInput()) return;

        setLoginLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: input.email,
            password: input.password,
        });
        setLoginLoading(false);

        if (error) {
            return setError((prev) => {
                return {
                    ...prev,
                    login: "Invalid email/password",
                };
            });
        }
        router.push("/home");
    };

    return (
        <div className="flex flex-col items-center bg-zinc-800 w-full h-max text-zinc-100 flex-1">
            <form
                onSubmit={(e) => handleLogin(e)}
                className="flex flex-col my-12 w-[90%] sm:w-[350px] gap-6"
            >
                <h1 className="text-4xl">Log In</h1>
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email</label>
                    <NonSSRWrapper>
                        <input
                            id="email"
                            name="email"
                            value={input.email}
                            onChange={(e) => handleChange(e)}
                            className="border border-zinc-500 rounded py-1 px-2 bg-zinc-900"
                        />
                    </NonSSRWrapper>

                    <ErrorMessage message={error.email} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <NonSSRWrapper>
                        {" "}
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={input.password}
                            onChange={(e) => handleChange(e)}
                            className="border border-zinc-500 rounded py-1 px-2 bg-zinc-900"
                        />
                    </NonSSRWrapper>

                    <ErrorMessage message={error.password} />
                </div>
                <ErrorMessage message={error.login} />
                <div className="text-center w-full flex flex-col gap-4 mt-2">
                    <button
                        onClick={handleLogin}
                        disabled={loginLoading}
                        className="flex justify-center items-center gap-2 disabled:bg-zinc-300 w-full rounded bg-zinc-100 py-2 text-zinc-900 hover:bg-zinc-300 transition-colors"
                    >
                        {loginLoading && (
                            <div className="w-4 h-4 border-2 border-zinc-900 border-t-2 border-b-2 border-t-zinc-300 border-b-zinc-300 animate-spin rounded-full" />
                        )}
                        Log In
                    </button>
                    <div className="text-sm text-zinc-200">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
            <Footer />
        </div>
    );
}
