"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Modal from "../shared/Modal";

export default function DeleteAccountButton() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);
        const response = await fetch("/api/deleteAccount", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const res = await response.json();
        setLoading(false);

        if (res.error) {
            setOpenModal(false);
            alert("An error occurred. Check the console for details.");
            return console.log(res.error);
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
            setOpenModal(false);
            alert("An error occurred. Check the console for details.");
            return console.log(error);
        }

        router.push("/");
    };

    return (
        <>
            <button
                onClick={() => setOpenModal(true)}
                className="self-start px-2 py-1 rounded border border-red-600 text-red-600 transition-colors hover:text-white hover:bg-red-600"
            >
                Delete Account
            </button>
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <Dialog.Panel className="flex flex-col gap-4 max-w-md transform overflow-hidden bg-white rounded p-6 shadow-xl transition-all">
                    <div>
                        <p className="text-slate-900 text-lg">Are you sure?</p>
                        <p className="text-slate-500 text-sm">
                            {" "}
                            All your files and data will be permanently deleted.
                        </p>
                    </div>

                    <div className="mt-1 flex justify-between w-full">
                        <button
                            className="px-2 py-1 rounded border border-zinc-900 text-zinc-900 transition-colors hover:bg-zinc-200"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex items-center gap-1 px-2 py-1 rounded bg-red-600 text-white transition-colors hover:bg-red-700 disabled:bg-red-700"
                            onClick={handleDeleteAccount}
                            disabled={loading}
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-red-700 border-t-2 border-b-2 border-t-white border-b-white animate-spin rounded-full" />
                            )}
                            Delete Account
                        </button>
                    </div>
                </Dialog.Panel>
            </Modal>
        </>
    );
}
