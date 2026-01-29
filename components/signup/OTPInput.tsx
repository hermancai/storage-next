"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/lib/client/verifyOtp";
import ErrorMessage from "@/components/shared/ErrorMessage";

type OTPInputType = {
    email: string;
};

export default function OTPInput({ email }: OTPInputType) {
    const router = useRouter();

    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyCode = async () => {
        if (!input.trim()) {
            setInput("");
            return setError("Enter the code");
        }

        setLoading(true);
        const { data, error } = await verifyOtp(email, input, location.origin);
        setLoading(false);

        if (error || !data.session) {
            return setError("Invalid code");
        }
        router.push("/home");
    };

    return (
        <div className="flex flex-col gap-4">
            <p>
                A verification code has been sent to{" "}
                <span className="font-bold">{email}</span>
            </p>
            <p>Enter the code to finish setting up your account.</p>
            <input
                className="p-2 rounded bg-zinc-900 border border-zinc-500 text-center w-full"
                id="signup-code"
                type="text"
                placeholder="Verification Code"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            {error === "" ? null : (
                <div className="flex w-full justify-center">
                    <ErrorMessage message={error} />
                </div>
            )}

            <button
                className="px-2 py-2 rounded text-zinc-900 bg-zinc-100 transition-colors hover:bg-zinc-300"
                onClick={handleVerifyCode}
                disabled={loading}
            >
                Verify
            </button>
        </div>
    );
}
