"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import ErrorMessage from "@/components/shared/ErrorMessage";
import SuccessToast from "@/components/shared/SuccessToast";
import { toast } from "react-toastify";
import changeUsername from "@/lib/client/changeUsername";

type UserFormProps = {
    user: User | null;
};

export default function UserForm({ user }: UserFormProps) {
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
        const { error: updateError } = await changeUsername(newUsername.trim());
        setLoading(false);

        if (updateError) {
            setError("An error occurred while updating.");
            return console.log(updateError);
        }

        setNewUsername("");
        toast(<SuccessToast message="Username updated." />);
    };

    return (
        <div className="flex flex-col p-4 pt-2 gap-2 bg-zinc-900 rounded">
            <p className="font-bold">Change Username</p>
            <span className="h-0 w-full border border-zinc-400" />
            <div className="flex flex-col gap-1">
                <label htmlFor="change-username" className="text-sm">
                    New Username
                </label>
                <input
                    type="text"
                    id="change-username"
                    className="py-1 px-2 rounded bg-zinc-800 border border-zinc-500"
                    value={newUsername}
                    size={1}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <ErrorMessage message={error} />
            </div>
            <button
                onClick={handleChangeUsername}
                disabled={loading}
                className="mt-2 self-end px-2 py-1 rounded bg-zinc-100 text-zinc-900 transition-colors hover:bg-zinc-300 disabled:bg-zinc-300"
            >
                Update
            </button>
        </div>
    );
}
