"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NonSSRWrapper from "@/components/shared/NonSSRWrapper";

export default function SignupPage() {
    const [input, setInput] = useState({
        email: "",
        password: "",
        confirm: "",
        name: "",
    });
    const [error, setError] = useState({
        email: "",
        password: "",
        confirm: "",
        name: "",
        signup: "",
    });
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

    const validateInput = (): boolean => {
        let valid = true;

        if (!input.name.trim()) {
            valid = false;
            setError((prev) => {
                return { ...prev, name: "Please enter a name." };
            });
        }

        if (!input.email.trim()) {
            valid = false;
            setError((prev) => {
                return { ...prev, email: "Please enter an email." };
            });
        }

        if (!input.password) {
            valid = false;
            setError((prev) => {
                return { ...prev, password: "Please enter a password." };
            });
        } else {
            if (input.password.length < 6) {
                valid = false;
                setError((prev) => {
                    return {
                        ...prev,
                        password: "Password should be at least 6 characters.",
                    };
                });
            } else if (input.password !== input.confirm) {
                valid = false;
                setError((prev) => {
                    return { ...prev, confirm: "Passwords do not match." };
                });
            }
        }

        return valid;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();

        setError({
            email: "",
            name: "",
            password: "",
            confirm: "",
            signup: "",
        });
        if (!validateInput()) return;

        setSignupLoading(true);
        const signUpRes = await supabase.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
                data: {
                    name: input.name,
                },
                // redirect user after verifying email
                emailRedirectTo: `${location.origin}/api/signup`,
            },
        });
        setSignupLoading(false);

        if (signUpRes.error) {
            switch (signUpRes.error.message) {
                case "Unable to validate email address: invalid format":
                    setError((prev) => {
                        return {
                            ...prev,
                            email: "The email address format is invalid.",
                        };
                    });
                    break;
                case "Password should be at least 6 characters":
                    setError((prev) => {
                        return {
                            ...prev,
                            email: "Password should be at least 6 characters.",
                        };
                    });
                    break;
                default:
                    setError((prev) => {
                        return {
                            ...prev,
                            signup: "An error occurred while signing up.",
                        };
                    });
            }
            return;
        }

        // According to supabase, this means the email is taken
        if (signUpRes.data.user?.identities?.length === 0) {
            return setError((prev) => {
                return { ...prev, email: "This email already has an account." };
            });
        }

        setSignupSuccess(true);
        router.refresh();
    };

    return (
        <div className="flex justify-center items-center">
            <form
                onSubmit={handleSignUp}
                className="flex flex-col my-16 w-[90%] sm:w-[350px] gap-8 text-slate-700"
            >
                <h1 className="text-4xl">Sign Up</h1>
                {signupSuccess ? (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-8 h-8 text-green-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p>
                            A verification link has been sent to{" "}
                            <span className="font-bold">{input.email}</span>
                            <br />
                            Please click the link to finish setting up your
                            account.
                            <br />
                            This page can be closed.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-slate-500">
                                Email
                            </label>
                            <NonSSRWrapper>
                                {" "}
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={input.email}
                                    onChange={(e) => handleChange(e)}
                                    className="p-1 border-b border-b-slate-500"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.email} />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-slate-500">
                                Username
                            </label>
                            <NonSSRWrapper>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={input.name}
                                    onChange={(e) => handleChange(e)}
                                    className="p-1 border-b border-b-slate-500"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.name} />
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="password"
                                className="text-slate-500"
                            >
                                Password
                            </label>
                            <NonSSRWrapper>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={input.password}
                                    onChange={(e) => handleChange(e)}
                                    className="p-1 border-b border-b-slate-500"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.password} />
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="confirm-password"
                                className="text-slate-500"
                            >
                                Confirm Password
                            </label>
                            <NonSSRWrapper>
                                {" "}
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm"
                                    value={input.confirm}
                                    onChange={(e) => handleChange(e)}
                                    className="p-1 border-b border-b-slate-500"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.confirm} />
                        </div>
                        <ErrorMessage message={error.signup} />
                        <div className="text-center w-full flex flex-col gap-4">
                            <button
                                onClick={handleSignUp}
                                disabled={signupLoading}
                                className="flex justify-center items-center gap-2 disabled:bg-slate-900 w-full rounded bg-slate-700 py-2 text-white hover:bg-slate-900 transition-colors"
                            >
                                {signupLoading && (
                                    <div className="w-4 h-4 border-2 border-slate-900 border-t-2 border-b-2 border-t-white border-b-white animate-spin rounded-full" />
                                )}
                                Sign Up
                            </button>
                            <div className="text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-slate-700 underline"
                                >
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
