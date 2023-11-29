"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@headlessui/react";
import SuccessToast from "../shared/SuccessToast";
import { toast } from "react-toastify";
import ErrorMessage from "../shared/ErrorMessage";
import Modal from "../shared/Modal";

type FolderType = {
    name: string;
    id: string;
};

type FolderCreateType = {
    currentFolder: string;
    setNestedFolders: Dispatch<SetStateAction<FolderType[]>>;
};

export default function FolderCreate({
    currentFolder,
    setNestedFolders,
}: FolderCreateType) {
    const supabase = createClientComponentClient();

    const [folderInput, setFolderInput] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFolderInput(e.target.value);
    };

    const createFolder = async () => {
        setError("");
        if (!folderInput.trim()) return;

        setLoading(true);
        const { data, error } = await supabase
            .from("folder")
            .insert({ parent: currentFolder, name: folderInput })
            .select("id, name");
        setLoading(false);
        if (error) {
            setError("An unexpected error occurred.");
            return console.log(error);
        }
        setNestedFolders((prevState) => [
            ...prevState,
            { name: data[0].name, id: data[0].id },
        ]);
        setFolderInput("");
        setOpenModal(false);
        toast(<SuccessToast message="New folder created." />);
    };

    const closeModal = () => {
        setError("");
        setFolderInput("");
        setOpenModal(false);
    };

    return (
        <div>
            <button
                className="border border-slate-700 rounded flex flex-nowrap whitespace-nowrap gap-2 px-2 py-1 transition-colors hover:bg-slate-200"
                onClick={() => setOpenModal(true)}
            >
                <div>
                    {" "}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.3"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        />
                    </svg>
                </div>
                New Folder
            </button>
            <Modal isOpen={openModal} onClose={closeModal}>
                <Dialog.Panel className="flex flex-col gap-4 w-[90%] max-w-md transform overflow-hidden bg-white rounded p-4 sm:p-6 shadow-xl transition-all">
                    <p>Create New Folder</p>
                    <input
                        id="create-folder"
                        type="text"
                        value={folderInput}
                        onChange={(e) => handleFolderChange(e)}
                        placeholder="Folder Name"
                        className="px-2 py-1 border border-slate-700 rounded"
                    />
                    {error !== "" && <ErrorMessage message={error} />}
                    <div className="mt-1 flex justify-between w-full">
                        <button
                            className="px-2 py-1 rounded border border-slate-700 text-slate-700 transition-colors hover:bg-slate-200"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-2 py-1 rounded bg-slate-700 text-white transition-colors hover:bg-slate-900 disabled:bg-slate-900"
                            onClick={createFolder}
                            disabled={loading}
                        >
                            Create
                        </button>
                    </div>
                </Dialog.Panel>
            </Modal>
        </div>
    );
}
