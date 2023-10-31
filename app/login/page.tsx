"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NonSSRWrapper from "@/components/shared/NonSSRWrapper";

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
        <div className="flex justify-center items-center">
            <form
                onSubmit={(e) => handleLogin(e)}
                className="flex flex-col my-16 w-[90%] sm:w-[350px] gap-8 text-slate-700"
            >
                <h1 className="text-4xl">Log In</h1>
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-slate-500">
                        Email
                    </label>
                    <NonSSRWrapper>
                        <input
                            id="email"
                            name="email"
                            value={input.email}
                            onChange={(e) => handleChange(e)}
                            className="p-1 border-b border-b-slate-500"
                        />
                    </NonSSRWrapper>

                    <ErrorMessage message={error.email} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-slate-500">
                        Password
                    </label>
                    <NonSSRWrapper>
                        {" "}
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={input.password}
                            onChange={(e) => handleChange(e)}
                            className="p-1 border-b border-b-slate-500"
                        />
                    </NonSSRWrapper>

                    <ErrorMessage message={error.password} />
                </div>
                <ErrorMessage message={error.login} />
                <div className="text-center w-full flex flex-col gap-4">
                    <button
                        onClick={handleLogin}
                        disabled={loginLoading}
                        className="flex justify-center items-center gap-2 disabled:bg-slate-900 w-full rounded bg-slate-700 py-2 text-white hover:bg-slate-900 transition-colors"
                    >
                        {loginLoading && (
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-2 border-b-2 border-t-white border-b-white animate-spin rounded-full" />
                        )}
                        Log In
                    </button>
                    <div className="text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-slate-700 underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
