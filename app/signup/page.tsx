"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NonSSRWrapper from "@/components/shared/NonSSRWrapper";
import OTPInput from "@/components/signup/OTPInput";
import Footer from "@/components/shared/Footer";

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
    const [showOTPInput, setshowOTPInput] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

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

        setshowOTPInput(true);
    };

    return (
        <div className="flex flex-col items-center bg-zinc-800 w-full h-max text-zinc-100 flex-1">
            <div className="flex flex-col my-12 gap-6 w-[90%] sm:w-[350px]">
                <h1 className="text-4xl">Sign Up</h1>
                {showOTPInput ? (
                    <OTPInput email={input.email} />
                ) : (
                    <form
                        className="flex flex-col gap-6 h-full"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email">Email</label>
                            <NonSSRWrapper>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={input.email}
                                    onChange={(e) => handleChange(e)}
                                    className="border border-zinc-500 rounded py-1 px-2 bg-zinc-900"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.email} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name">Username</label>
                            <NonSSRWrapper>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={input.name}
                                    onChange={(e) => handleChange(e)}
                                    className="border border-zinc-500 rounded py-1 px-2 bg-zinc-900"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.name} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password">Password</label>
                            <NonSSRWrapper>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={input.password}
                                    onChange={(e) => handleChange(e)}
                                    className="border border-zinc-500 rounded py-1 px-2 bg-zinc-900"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.password} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="confirm-password">
                                Confirm Password
                            </label>
                            <NonSSRWrapper>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirm"
                                    value={input.confirm}
                                    onChange={(e) => handleChange(e)}
                                    className="border border-zinc-500 rounded py-1 px-2 bg-zinc-900"
                                />
                            </NonSSRWrapper>

                            <ErrorMessage message={error.confirm} />
                        </div>
                        <ErrorMessage message={error.signup} />
                        <div className="text-center w-full flex flex-col gap-4 mt-2">
                            <button
                                onClick={handleSignUp}
                                disabled={signupLoading}
                                className="flex justify-center items-center gap-2 disabled:bg-zinc-300 w-full rounded bg-zinc-100 py-2 text-zinc-900 hover:bg-zinc-300 transition-colors"
                            >
                                {signupLoading && (
                                    <div className="w-4 h-4 border-2 border-zinc-900 border-t-2 border-b-2 border-t-zinc-300 border-b-zinc-300 animate-spin rounded-full" />
                                )}
                                Sign Up
                            </button>
                            <div className="text-sm text-zinc-200">
                                Already have an account?{" "}
                                <Link href="/login" className="underline">
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
}
