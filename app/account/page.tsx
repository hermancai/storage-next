"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import useGetUser from "@/hooks/useGetUser";
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const user = useGetUser();

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangeUsername = async () => {
        if (!user || !newUsername || newUsername === user.user_metadata.name) {
            return;
        }

        const { error } = await supabase.auth.updateUser({
            data: { name: newUsername },
        });
        if (error) {
            return console.log(error);
        }
        setNewUsername("");
    };

    const handleChangeEmail = async () => {
        if (!user || !newEmail || newEmail === user.email) {
            return;
        }

        const { error } = await supabase.auth.updateUser({
            email: newEmail,
        });
        if (error) {
            return console.log(error);
        }
        setNewEmail("");
    };

    const handleChangePassword = async () => {
        if (
            !currentPassword ||
            !newPassword ||
            newPassword !== confirmPassword
        ) {
            return;
        }

        const { error } = await supabase.rpc("change_user_password", {
            current_plain_password: currentPassword,
            new_plain_password: newPassword,
        });
        if (error) {
            return console.log(error);
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleDeleteAccount = async () => {
        const response = await fetch("/api/deleteAccount", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const res = await response.json();
        if (res.error) {
            return console.log(res.error);
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
            return console.log(error);
        }
        router.push("/");
    };

    if (!user) {
        return <div>loading</div>;
    }

    return (
        <div>
            <div>
                <p>Current Username: {user.user_metadata.name}</p>
                <label htmlFor="change-username">Change Username:</label>
                <input
                    type="text"
                    id="change-username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <button onClick={handleChangeUsername}>CHANGE USERNAME</button>
            </div>
            <br />
            <div>
                <p>Current email: {user.email}</p>
                <label htmlFor="change-email">Change Email:</label>
                <input
                    type="text"
                    id="change-email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={handleChangeEmail}>CHANGE EMAIL</button>
            </div>
            <br />
            <div>
                <p>Change Password:</p>
                <label htmlFor="old-password">Old Password</label>
                <input
                    type="password"
                    id="old-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <label htmlFor="new-password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleChangePassword}>CHANGE PASSWORD</button>
            </div>
            <br />
            <button onClick={handleDeleteAccount}>DELETE ACCOUNT</button>
        </div>
    );
}
