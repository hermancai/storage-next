"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { ChangeEvent, useState } from "react";
import ErrorMessage from "../shared/ErrorMessage";
import { toast } from "react-toastify";
import SuccessToast from "../shared/SuccessToast";

type UserFormProps = {
    user: User | null;
};

export default function PasswordForm({ user }: UserFormProps) {
    const supabase = createClientComponentClient();

    const [input, setInput] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const validateInput = (): boolean => {
        let valid = true;
        setError({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        if (!input.currentPassword) {
            valid = false;
            setError((prev) => {
                return {
                    ...prev,
                    currentPassword: "Enter the current password.",
                };
            });
        }

        if (!input.newPassword) {
            valid = false;
            setError((prev) => {
                return { ...prev, newPassword: "Enter a new password." };
            });
        } else {
            if (input.newPassword.length < 6) {
                valid = false;
                setError((prev) => {
                    return {
                        ...prev,
                        newPassword:
                            "New password must be at least 6 characters.",
                    };
                });
            } else {
                if (input.newPassword !== input.confirmPassword) {
                    valid = false;
                    setError((prev) => {
                        return {
                            ...prev,
                            confirmPassword:
                                "New password does not match confirmed password.",
                        };
                    });
                }
            }
        }

        return valid;
    };

    const handleChangePassword = async () => {
        if (!validateInput()) return;

        const { error } = await supabase.rpc("change_user_password", {
            current_plain_password: input.currentPassword,
            new_plain_password: input.newPassword,
        });
        if (error) {
            switch (error.message) {
                case "incorrect password":
                    setError((prev) => {
                        return {
                            ...prev,
                            currentPassword: "Current password is incorrect.",
                        };
                    });
                    break;
                default:
                    setError((prev) => {
                        return {
                            ...prev,
                            confirmPassword: "An unexpected error occurred.",
                        };
                    });
            }
            return console.log(error);
        }

        setInput({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast(<SuccessToast message="Password updated" />);
    };

    return (
        <div className="flex flex-col p-4 pt-2 gap-2 bg-zinc-900 rounded">
            <p className="font-bold">Change Password</p>
            <span className="h-0 w-full border border-zinc-400" />
            <div className="flex flex-col gap-1">
                <label htmlFor="current-password" className="text-sm">
                    Current Password
                </label>
                <input
                    type="password"
                    id="current-password"
                    name="currentPassword"
                    size={1}
                    value={input.currentPassword}
                    onChange={(e) => handleInputChange(e)}
                    className="py-1 px-2 rounded bg-zinc-800 border border-zinc-500"
                />
                <ErrorMessage message={error.currentPassword} />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="new-password" className="text-sm">
                    New Password
                </label>
                <input
                    type="password"
                    id="new-password"
                    name="newPassword"
                    size={1}
                    value={input.newPassword}
                    onChange={(e) => handleInputChange(e)}
                    className="py-1 px-2 rounded bg-zinc-800 border border-zinc-500"
                />
                <ErrorMessage message={error.newPassword} />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="confirm-password" className="text-sm">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    size={1}
                    value={input.confirmPassword}
                    onChange={(e) => handleInputChange(e)}
                    className="py-1 px-2 rounded bg-zinc-800 border border-zinc-500"
                />
                <ErrorMessage message={error.confirmPassword} />
            </div>
            <button
                onClick={handleChangePassword}
                disabled={loading}
                className="mt-2 self-end px-2 py-1 rounded bg-zinc-100 text-zinc-900 transition-colors hover:bg-zinc-300 disabled:bg-zinc-300"
            >
                Update
            </button>
        </div>
    );
}
