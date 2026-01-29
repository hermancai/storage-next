"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import ErrorMessage from "@/components/shared/ErrorMessage";
import SuccessToast from "@/components/shared/SuccessToast";
import SuccessMessage from "@/components/shared/SuccessMessage";
import { toast } from "react-toastify";
import changeEmail from "@/lib/client/changeEmail";

type EmailFormProps = {
    user: User | null;
};

export default function EmailForm({ user }: EmailFormProps) {
    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChangeEmail = async () => {
        if (!user) return;
        if (!newEmail.trim() || newEmail.trim() === user.email) {
            setError("Enter a new email.");
            return;
        }

        setError("");
        setSuccessMessage("");
        setLoading(true);
        const { error: updateError } = await changeEmail(newEmail.trim());
        setLoading(false);

        if (updateError) {
            switch (updateError.message) {
                case "Unable to validate email address: invalid format":
                    setError("Invalid email address format");
                    break;
                case "A user with this email address has already been registered":
                    setError(
                        "The email is already registered to a different account."
                    );
                    break;
                default:
                    setError("An unexpected error occurred.");
            }
            return;
        }

        setSuccessMessage(
            "Verification links have been sent. The links expire in 24 hours."
        );
        toast(<SuccessToast message="Verification links sent." />);
    };

    return (
        <div className="flex flex-col p-4 pt-2 gap-2 bg-zinc-900 rounded">
            <div>
                <p className="font-bold">Change Email</p>
                <p className="text-sm">
                    Verification links will be sent to both your current and new
                    email. Both links must be clicked to complete the email
                    change.
                </p>
            </div>
            <span className="h-0 w-full border border-zinc-400" />
            <div className="flex flex-col gap-1">
                <label htmlFor="change-email" className="text-sm">
                    New Email
                </label>
                <input
                    type="text"
                    id="change-email"
                    className="py-1 px-2 rounded bg-zinc-800 border border-zinc-500"
                    size={1}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <ErrorMessage message={error} />
                <SuccessMessage message={successMessage} />
            </div>
            <button
                onClick={handleChangeEmail}
                disabled={loading}
                className="mt-2 self-end px-2 py-1 rounded bg-zinc-100 text-zinc-900 transition-colors hover:bg-zinc-300 disabled:bg-zinc-300"
            >
                Update
            </button>
        </div>
    );
}
