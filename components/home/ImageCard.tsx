"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from "react";
import CardOptions from "./CardOptions";
import DownloadButton from "./DownloadButton";
import RenameButton from "./RenameButton";
import DeleteButton from "./DeleteButton";
import Modal from "../shared/Modal";
import ErrorMessage from "../shared/ErrorMessage";
import { Dialog } from "@headlessui/react";
import TableCellWrapper from "./TableCellWrapper";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
    created_at: string;
};

type ImageCardType = {
    image: ImageType;
    setCurrentImages: Dispatch<SetStateAction<ImageType[]>>;
    showGrid: boolean;
};

function ImageIcon() {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.3"
                stroke="currentColor"
                className="w-6 h-6 text-green-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
            </svg>
        </div>
    );
}

export default function ImageCard({
    image,
    setCurrentImages,
    showGrid,
}: ImageCardType) {
    const [renameInput, setRenameInput] = useState("");
    const [renameError, setRenameError] = useState("");
    const [renameLoading, setRenameLoading] = useState(false);
    const [openRenameModal, setOpenRenameModal] = useState(false);

    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [openImageModal, setOpenImageModal] = useState(false);

    const handleOpenRenameModal = useCallback(() => {
        setOpenRenameModal(true);
    }, []);
    const handleOpenDeleteModal = useCallback(
        () => setOpenDeleteModal(true),
        []
    );
    const handleOpenImageModal = useCallback(() => setOpenImageModal(true), []);

    const handleCloseRenameModal = useCallback(() => {
        setRenameInput("");
        setOpenRenameModal(false);
    }, []);
    const handleCloseDeleteModal = useCallback(
        () => setOpenDeleteModal(false),
        []
    );
    const handleCloseImageModal = useCallback(
        () => setOpenImageModal(false),
        []
    );

    const imageCreatedAt = useMemo(() => {
        return new Date(image.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }, [image.created_at]);

    const deleteImage = async () => {
        setDeleteError("");
        setDeleteLoading(true);
        const deleteResponse = await fetch("/api/deleteImage", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                s3_id: image.s3_id,
            }),
        });
        const deleteRes = await deleteResponse.json();
        setDeleteLoading(false);
        if (deleteRes.error) {
            setDeleteError("An unexpected error occurred.");
            return console.log(deleteRes.error);
        }

        setCurrentImages((prevState) =>
            prevState.filter((entry) => entry.s3_id !== image.s3_id)
        );
    };

    const renameImage = async () => {
        if (!renameInput.trim()) {
            return;
        }

        setRenameError("");
        setRenameLoading(true);

        // Concat new file name with extension
        const newFileName =
            renameInput +
            image.name.substring(
                image.name.lastIndexOf("."),
                image.name.length
            );

        const supabase = createClientComponentClient();
        const { error } = await supabase
            .from("image")
            .update({ name: newFileName })
            .eq("s3_id", image.s3_id);
        setRenameLoading(false);
        if (error) {
            setRenameError("An unexpected error occurred.");
            return console.log(error);
        }

        setRenameInput("");
        setCurrentImages((prevState) => {
            const newList = [...prevState];
            for (let i = 0; i < newList.length; i++) {
                if (newList[i].s3_id === image.s3_id) {
                    newList[i].name = newFileName;
                    break;
                }
            }
            return newList;
        });
        handleCloseRenameModal();
    };

    const getFullImage = async () => {
        const response = await fetch("api/getFullImage", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ s3_id: image.s3_id, name: image.name }),
        });

        const res = await response.json();
        if (res.error) {
            return console.log(res.error);
        }
        window.open(res.url, "_blank");
    };

    return (
        <>
            {showGrid ? (
                <div className="w-full flex flex-col gap-2 px-3 py-2 rounded bg-slate-100">
                    <div
                        className="flex flex-row flex-nowrap gap-2 items-center"
                        title={"Image: " + image.name}
                    >
                        <ImageIcon />
                        <p className="whitespace-nowrap text-ellipsis overflow-hidden text-sm text-slate-900">
                            {image.name}
                        </p>
                        <div className="ml-auto [display:inherit] text-sm">
                            <CardOptions>
                                <DownloadButton onClick={getFullImage} />
                                <RenameButton onClick={handleOpenRenameModal} />
                                <DeleteButton onClick={handleOpenDeleteModal} />
                            </CardOptions>
                        </div>
                    </div>
                    <div
                        className="relative w-full aspect-square cursor-zoom-in"
                        onClick={handleOpenImageModal}
                    >
                        <Image
                            src={image.presignedUrl}
                            alt={image.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            ) : (
                <tr className="transition-colors hover:bg-slate-100 flex items-center border-b text-sm pl-2 gap-2">
                    <td
                        className="grow overflow-hidden"
                        onClick={handleOpenImageModal}
                        title={image.name}
                    >
                        <div className="flex flex-nowrap items-center gap-2 cursor-zoom-in py-1">
                            <ImageIcon />
                            <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                                {image.name}
                            </span>
                        </div>
                    </td>
                    <td className="min-w-[90px] whitespace-nowrap">
                        {imageCreatedAt}
                    </td>
                    <td className="p-1 [display:inherit]">
                        <CardOptions>
                            <DownloadButton onClick={getFullImage} />
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
                            <span className="underline">Rename Image</span>
                            <br />
                            <span className="text-sm">{image.name}</span>
                        </p>
                        <input
                            id="create-folder"
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            placeholder="New Name"
                            className="px-2 py-1 border border-slate-700 rounded"
                        />
                        {renameError !== "" && (
                            <ErrorMessage message={renameError} />
                        )}
                        <div className="mt-1 flex justify-between w-full">
                            <button
                                className="px-2 py-1 rounded border border-slate-700 text-slate-700 transition-colors hover:bg-slate-200"
                                onClick={handleCloseRenameModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-slate-700 text-white transition-colors hover:bg-slate-900 disabled:bg-slate-900"
                                onClick={renameImage}
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
                            <span className="underline">Delete Image</span>
                            <br />
                            <span className="text-sm">{image.name}</span>
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
                                onClick={deleteImage}
                                disabled={deleteLoading}
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </Modal>
                <Modal isOpen={openImageModal} onClose={handleCloseImageModal}>
                    <Dialog.Panel className="flex flex-col w-[80%] h-[80%] relative">
                        <button
                            className="z-10 absolute right-0 top-0 bg-black border-2 rounded p-1 w-min cursor-pointer"
                            onClick={handleCloseImageModal}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <Image
                            src={image.presignedUrl}
                            alt={image.name}
                            fill
                            style={{
                                objectFit: "contain",
                            }}
                        />
                    </Dialog.Panel>
                </Modal>
            </TableCellWrapper>
        </>
    );
}
