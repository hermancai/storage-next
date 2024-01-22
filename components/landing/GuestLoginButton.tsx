"use client";

import { useState } from "react";

export default function GuestLoginButton() {
    const [loading, setLoading] = useState(false);

    const loginGuest = async () => {
        setLoading(true);
        const loginRes = await fetch("/api/guestLogin", { method: "GET" });
        setLoading(false);

        if (!loginRes.ok) {
            return console.log("Error logging in as guest");
        }

        window.location.reload();
    };

    return (
        <button
            onClick={loginGuest}
            disabled={loading}
            className="flex flex-nowrap justify-center items-center gap-1 shadow py-2 px-3 rounded whitespace-nowrap bg-zinc-100 text-zinc-900 border border-zinc-900 transition-colors hover:bg-zinc-300"
        >
            {loading && (
                <div className="border-2 rounded-full h-4 w-4 border-zinc-100 border-t-zinc-900 animate-spin" />
            )}
            Guest Demo
        </button>
    );
}
