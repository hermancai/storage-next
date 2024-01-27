"use client";

import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import LogoHomeLink from "../shared/LogoHomeLink";

export default function Navbar() {
    const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL!;

    const router = useRouter();
    const supabase = createClientComponentClient();
    const { user, loading: loadingUser } = useGetUser();
    const [signoutLoading, setSignoutLoading] = useState(false);

    const handleSignOut = async () => {
        setSignoutLoading(true);
        const { error } = await supabase.auth.signOut();
        setSignoutLoading(false);
        if (error) {
            return console.log(error);
        }
        window.location.reload();
    };

    return (
        <div className="h-[75px] w-full flex justify-between items-center border-b border-zinc-500 bg-zinc-900 p-4 gap-4">
            <LogoHomeLink />
            {loadingUser ? null : (
                <div className="flex gap-2 sm:gap-4 items-center min-w-0 max-w-md">
                    {user !== null ? (
                        <>
                            <span className="whitespace-nowrap overflow-hidden overflow-ellipsis text-zinc-100">
                                {user.user_metadata.name}
                            </span>

                            <Menu
                                as="div"
                                className="relative [display:inherit]"
                            >
                                <Menu.Button aria-label="User Menu">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.2"
                                        stroke="currentColor"
                                        className="w-8 h-8 hover:bg-zinc-700 rounded transition-colors text-zinc-100"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        as="div"
                                        className="z-10 absolute right-0 top-9 border border-zinc-500 rounded p-1 bg-zinc-900 flex flex-col gap-1 text-zinc-100 origin-top-right max-w-[250px]"
                                    >
                                        <Menu.Item disabled>
                                            <div className="px-4 py-1 w-full overflow-hidden">
                                                <div className="break-words">
                                                    <p>
                                                        {
                                                            user.user_metadata
                                                                .name
                                                        }
                                                    </p>
                                                    {user.email ===
                                                    guestEmail ? (
                                                        <p className="text-red-400 text-sm italic">
                                                            Guest account
                                                            management is
                                                            disabled.
                                                        </p>
                                                    ) : (
                                                        <p className="text-zinc-400 text-sm">
                                                            {user.email}
                                                        </p>
                                                    )}
                                                    <div className="h-0 w-full border border-slate-400 mt-3" />
                                                </div>
                                            </div>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link
                                                href="/home"
                                                className="whitespace-nowrap w-full px-4 py-2 rounded hover:bg-zinc-700 text-left flex flex-nowrap gap-2 items-center transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                                    />
                                                </svg>
                                                Home
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link
                                                href="/account"
                                                aria-disabled={
                                                    user.email === guestEmail
                                                }
                                                className={`whitespace-nowrap w-full px-4 py-2 rounded hover:bg-zinc-700 text-left flex flex-nowrap gap-2 items-center transition-colors ${
                                                    user.email === guestEmail
                                                        ? "pointer-events-none text-slate-500"
                                                        : ""
                                                }`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                Manage Account
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <button
                                                onClick={handleSignOut}
                                                disabled={signoutLoading}
                                                className="whitespace-nowrap w-full px-4 py-2 rounded hover:bg-zinc-700 text-left flex flex-nowrap gap-2 items-center transition-colors disabled:text-zinc-500"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                                                    />
                                                </svg>
                                                Log Out
                                            </button>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signup"
                                className="shadow py-2 px-3 rounded whitespace-nowrap flex flex-nowrap gap-2 items-center text-zinc-100 border border-zinc-100 transition-colors hover:bg-zinc-700"
                            >
                                Sign Up
                            </Link>
                            <Link
                                href="/login"
                                className="shadow border py-2 px-3 rounded whitespace-nowrap flex flex-nowrap gap-2 items-center bg-white text-zinc-900 transition-colors hover:bg-zinc-300 group"
                            >
                                Log In
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 transition group-hover:scale-110"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
