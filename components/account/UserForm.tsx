"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ErrorMessage from "../shared/ErrorMessage";
import NonSSRWrapper from "../shared/NonSSRWrapper";
import SuccessToast from "../shared/SuccessToast";
import { toast } from "react-toastify";

type UserFormProps = {
    user: User | null;
};

export default function UserForm({ user }: UserFormProps) {
    const supabase = createClientComponentClient();

    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangeUsername = async () => {
        if (!user) return;
        if (
            !newUsername.trim() ||
            newUsername.trim() === user.user_metadata.name
        ) {
            return setError("Enter a new username.");
        }

        setError("");
        setLoading(true);
        const { error: updateError } = await supabase.auth.updateUser({
            data: { name: newUsername.trim() },
        });
        setLoading(false);

        if (updateError) {
            setError("An error occurred while updating.");
            return console.log(updateError);
        }

        setNewUsername("");
        toast(<SuccessToast message="Username updated." />);
    };

    return (
        <div className="flex flex-col p-4 pt-2 gap-2 bg-slate-100 rounded shadow">
            <p className="font-bold">Change Username</p>
            <span className="h-0 w-full border border-slate-300" />
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="change-username"
                    className="text-sm text-slate-500"
                >
                    New Username
                </label>
                <NonSSRWrapper>
                    <input
                        type="text"
                        id="change-username"
                        className="py-1 px-2 rounded shadow"
                        value={newUsername}
                        size={1}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                </NonSSRWrapper>

                <ErrorMessage message={error} />
            </div>
            <button
                onClick={handleChangeUsername}
                disabled={loading}
                className="mt-2 self-end px-2 py-1 rounded bg-slate-700 text-white transition-colors hover:bg-slate-900 disabled:bg-slate-900 disabled:text-slate-400"
            >
                Update
            </button>
        </div>
    );
}
