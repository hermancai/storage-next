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
            className="flex flex-nowrap justify-center items-center gap-1 shadow py-2 px-3 rounded whitespace-nowrap bg-slate-100 text-slate-900 border border-slate-900 transition-colors hover:bg-slate-300"
        >
            {loading && (
                <div className="border-2 rounded-full h-4 w-4 border-slate-300 border-t-slate-900 animate-spin" />
            )}
            Guest Demo
        </button>
    );
}
