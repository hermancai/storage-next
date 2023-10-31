"use client";

import useGetUser from "@/hooks/useGetUser";
import Link from "next/link";
import UserForm from "@/components/account/UserForm";
import EmailForm from "@/components/account/EmailForm";
import PasswordForm from "@/components/account/PasswordForm";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";

export default function AccountPage() {
    const { user } = useGetUser();

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-screen-lg p-8 flex flex-col gap-6 grow">
                <Link
                    href="/home"
                    className="text-slate-700 underline flex flex-nowrap whitespace-nowrap items-center w-min"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.2"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                        />
                    </svg>
                    Back to Home
                </Link>
                <h1 className="text-3xl sm:text-4xl">Manage Account</h1>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] break-words p-4 pt-3 bg-slate-100 rounded shadow">
                    <p className="mr-2 text-right text-slate-500">Username: </p>
                    <p>{user === null ? "" : user.user_metadata.name}</p>
                    <p className="mr-2 text-right text-slate-500">Email: </p>
                    <p>{user === null ? "" : user.email}</p>
                </div>
                <UserForm user={user} />
                <EmailForm user={user} />
                <PasswordForm user={user} />
                <DeleteAccountButton />
            </div>
        </div>
    );
}
