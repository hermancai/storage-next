"use client";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import CardOptions from "./CardOptions";
import Modal from "../shared/Modal";
import { Dialog } from "@headlessui/react";
import ErrorMessage from "../shared/ErrorMessage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RenameButton from "./RenameButton";
import TableCellWrapper from "./TableCellWrapper";
import type { FolderType } from "@/custom-types";

type FolderCardType = {
    folder: FolderType;
    setNestedFolders: Dispatch<SetStateAction<FolderType[]>>;
    showGrid: boolean;
};

function FolderIcon() {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.3"
                stroke="currentColor"
                className="w-6 h-6 text-zinc-100"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
            </svg>
        </div>
    );
}

export default function FolderCard({
    folder,
    setNestedFolders,
    showGrid,
}: FolderCardType) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [renameInput, setRenameInput] = useState("");
    const [renameError, setRenameError] = useState("");
    const [renameLoading, setRenameLoading] = useState(false);
    const [openRenameModal, setOpenRenameModal] = useState(false);

    const handleOpenRenameModal = useCallback(() => {
        setOpenRenameModal(true);
    }, []);
    const handleOpenDeleteModal = useCallback(
        () => setOpenDeleteModal(true),
        []
    );

    const handleCloseRenameModal = useCallback(() => {
        setRenameInput("");
        setOpenRenameModal(false);
    }, []);
    const handleCloseDeleteModal = useCallback(
        () => setOpenDeleteModal(false),
        []
    );

    const renameFolder = async () => {
        if (!renameInput.trim()) {
            return;
        }

        setRenameError("");
        setRenameLoading(true);

        const supabase = createClientComponentClient();
        const { error } = await supabase
            .from("folder")
            .update({ name: renameInput })
            .eq("id", folder.id);
        setRenameLoading(false);
        if (error) {
            setRenameError("An unexpected error occurred.");
            return console.log(error);
        }

        setRenameInput("");
        setNestedFolders((prevState) => {
            const newList = [...prevState];
            for (let i = 0; i < newList.length; i++) {
                if (newList[i].id === folder.id) {
                    newList[i].name = renameInput;
                    break;
                }
            }
            return newList;
        });
        handleCloseRenameModal();
    };

    const deleteFolder = async () => {
        setDeleteError("");
        setDeleteLoading(true);
        const response = await fetch("/api/deleteFolder", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: folder.id }),
        });
        setDeleteLoading(false);
        const res = await response.json();
        if (res.error) {
            setDeleteError("An unexpected error occurred.");
            return console.log(res.error);
        }

        setNestedFolders((prevState) =>
            prevState.filter((entry) => entry.id !== folder.id)
        );
    };

    return (
        <>
            {showGrid ? (
                <>
                    <Link
                        href={`/home/folder/${folder.id}`}
                        title={"Folder: " + folder.name}
                        className="flex flex-row flex-nowrap items-center gap-2 px-3 py-2 rounded bg-zinc-900 transition-colors hover:bg-zinc-700"
                    >
                        <FolderIcon />
                        <p className="overflow-hidden whitespace-nowrap text-ellipsis text-zinc-100 text-sm">
                            {folder.name}
                        </p>
                        <div
                            className="ml-auto [display:inherit] text-sm"
                            onClick={(e) => e.preventDefault()}
                        >
                            <CardOptions>
                                <RenameButton onClick={handleOpenRenameModal} />
                                <DeleteButton onClick={handleOpenDeleteModal} />
                            </CardOptions>
                        </div>
                    </Link>
                </>
            ) : (
                <tr className="transition-colors hover:bg-zinc-700 flex items-center border-b border-zinc-500 text-sm pl-2">
                    <td className="grow overflow-hidden">
                        <Link
                            href={`/home/folder/${folder.id}`}
                            className="flex flex-nowrap items-center gap-2 py-1"
                            title={folder.name}
                        >
                            <FolderIcon />
                            <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                                {folder.name}
                            </span>
                        </Link>
                    </td>
                    <td className="p-1 [display:inherit]">
                        <CardOptions>
                            <RenameButton onClick={handleOpenRenameModal} />
                            <DeleteButton onClick={handleOpenDeleteModal} />
                        </CardOptions>
                    </td>
                </tr>
            )}
            <TableCellWrapper showGrid={showGrid}>
                <Modal
                    isOpen={openRenameModal}
                    onClose={handleCloseRenameModal}
                >
                    <Dialog.Panel className="flex flex-col gap-4 w-[90%] max-w-md transform overflow-hidden bg-white rounded p-4 sm:p-6 shadow-xl transition-all">
                        <p>
                            <span className="underline">Rename Folder</span>
                            <br />
                            <span className="text-sm">{folder.name}</span>
                        </p>
                        <input
                            id="create-folder"
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            placeholder="New Name"
                            className="px-2 py-1 border border-zinc-700 rounded"
                        />
                        {renameError !== "" && (
                            <ErrorMessage message={renameError} />
                        )}
                        <div className="mt-1 flex justify-between w-full">
                            <button
                                className="px-2 py-1 rounded border border-zinc-900 text-zinc-900 transition-colors hover:bg-zinc-200"
                                onClick={handleCloseRenameModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-zinc-900 text-zinc-100 transition-colors hover:bg-zinc-700 disabled:bg-slate-900"
                                onClick={renameFolder}
                                disabled={renameLoading}
                            >
                                Rename
                            </button>
                        </div>
                    </Dialog.Panel>
                </Modal>
                <Modal
                    isOpen={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                >
                    <Dialog.Panel className="flex flex-col gap-4 w-[90%] max-w-md transform overflow-hidden bg-white rounded p-4 sm:p-6 shadow-xl transition-all">
                        <p>
                            <span className="underline">Delete Folder</span>
                            <br />
                            <span className="text-sm">{folder.name}</span>
                        </p>

                        {deleteError !== "" && (
                            <ErrorMessage message={deleteError} />
                        )}
                        <div className="mt-1 flex justify-between w-full">
                            <button
                                className="px-2 py-1 rounded border border-slate-700 text-slate-700 transition-colors hover:bg-slate-200"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-red-600 text-white transition-colors hover:bg-red-700 disabled:bg-red-700"
                                onClick={deleteFolder}
                                disabled={deleteLoading}
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </Modal>
            </TableCellWrapper>
        </>
    );
}
