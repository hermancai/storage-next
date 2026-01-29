"use client";

import { Dispatch, SetStateAction, useState } from "react";
import CardOptions from "@/components/home/CardOptions";
import DownloadButton from "@/components/home/DownloadButton";
import RenameButton from "@/components/home/RenameButton";
import DeleteButton from "@/components/home/DeleteButton";
import Thumbnail from "@/components/home/Thumbnail";
import ImageModal from "@/components/home/ImageModal";
import TableCellWrapper from "@/components/home/TableCellWrapper";
import SuccessToast from "@/components/shared/SuccessToast";
import Modal from "@/components/shared/Modal";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Dialog } from "@headlessui/react";
import { ImageType } from "@/types/components";
import { toast } from "react-toastify";
import deleteImage from "@/lib/actions/deleteImage";
import renameImage from "@/lib/client/renameImage";
import getFullImage from "@/lib/actions/getFullImage";
import { usePathname } from "next/navigation";
import buildFileName from "@/lib/utility/buildFileName";
import appendAndClickDownload from "@/lib/utility/appendAndClickDownload";

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
    const pathName = usePathname();

    const [renameInput, setRenameInput] = useState("");
    const [renameError, setRenameError] = useState("");
    const [renameLoading, setRenameLoading] = useState(false);
    const [openRenameModal, setOpenRenameModal] = useState(false);

    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [openImageModal, setOpenImageModal] = useState(false);

    const handleCloseRenameModal = () => {
        setRenameInput("");
        setOpenRenameModal(false);
    };

    const handleDeleteImage = async () => {
        setDeleteError("");
        setDeleteLoading(true);

        const deleteImageRes = await deleteImage(image.s3_id, pathName);
        setDeleteLoading(false);

        if (!deleteImageRes.ok) {
            setDeleteError("An unexpected error occurred.");
            return console.log(deleteImageRes.error);
        }

        setCurrentImages((prevState) =>
            prevState.filter((entry) => entry.s3_id !== image.s3_id)
        );
        toast(<SuccessToast message="Image deleted." />);
    };

    const handleRenameImage = async () => {
        if (!renameInput.trim()) {
            return;
        }

        setRenameError("");
        setRenameLoading(true);

        const newFileName = buildFileName(image.name, renameInput);
        const renameImageRes = await renameImage(
            image.s3_id,
            newFileName,
            pathName
        );
        setRenameLoading(false);
        if (!renameImageRes.ok) {
            setRenameError("An unexpected error occurred.");
            return console.log(renameImageRes.error);
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
        toast(<SuccessToast message="Image renamed." />);
    };

    const handleGetFullImage = async () => {
        const fullImageRes = await getFullImage(image.s3_id, image.name);
        if (!fullImageRes.ok) {
            return console.log(fullImageRes.error);
        }

        appendAndClickDownload(fullImageRes.signedUrl, image.name);
    };

    return (
        <>
            {showGrid ? (
                <div className="w-full flex flex-col gap-2 p-2 rounded bg-zinc-900 hover:bg-zinc-700 transition-colors">
                    <div
                        className="flex flex-row flex-nowrap gap-2 items-center"
                        title={"Image: " + image.name}
                    >
                        <ImageIcon />
                        <p className="whitespace-nowrap text-ellipsis overflow-hidden text-sm text-zinc-100">
                            {image.name}
                        </p>
                        <div className="ml-auto [display:inherit] text-sm">
                            <CardOptions>
                                <DownloadButton onClick={handleGetFullImage} />
                                <RenameButton
                                    onClick={() => setOpenRenameModal(true)}
                                />
                                <DeleteButton
                                    onClick={() => setOpenDeleteModal(true)}
                                />
                            </CardOptions>
                        </div>
                    </div>
                    <div
                        className="relative w-full aspect-square cursor-zoom-in"
                        onClick={() => setOpenImageModal(true)}
                    >
                        <Thumbnail {...image} />
                    </div>
                </div>
            ) : (
                <tr className="transition-colors hover:bg-zinc-700 flex items-center border-b border-zinc-500 text-sm pl-2 gap-2">
                    <td
                        className="grow overflow-hidden"
                        onClick={() => setOpenImageModal(true)}
                        title={image.name}
                    >
                        <div className="flex flex-nowrap items-center gap-2 cursor-zoom-in py-1">
                            <ImageIcon />
                            <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                                {image.name}
                            </span>
                        </div>
                    </td>
                    <td className="p-1 [display:inherit]">
                        <CardOptions>
                            <DownloadButton onClick={handleGetFullImage} />
                            <RenameButton
                                onClick={() => setOpenRenameModal(true)}
                            />
                            <DeleteButton
                                onClick={() => setOpenDeleteModal(true)}
                            />
                        </CardOptions>
                    </td>
                </tr>
            )}
            <TableCellWrapper showGrid={showGrid}>
                <Modal
                    isOpen={openRenameModal}
                    onClose={handleCloseRenameModal}
                >
                    <Dialog.Panel className="flex flex-col gap-4 w-[90%] max-w-md transform overflow-hidden bg-zinc-100 rounded p-4 sm:p-6 shadow-xl transition-all">
                        <p>
                            <span className="underline">Rename Image</span>
                            <br />
                            <span className="text-sm">{image.name}</span>
                        </p>
                        <input
                            id="rename-image"
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
                                className="px-2 py-1 rounded border border-zinc-700 text-zinc-700 transition-colors hover:bg-zinc-200"
                                onClick={handleCloseRenameModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-zinc-900 text-zinc-100 transition-colors hover:bg-zinc-700 disabled:bg-slate-900"
                                onClick={handleRenameImage}
                                disabled={renameLoading}
                            >
                                Rename
                            </button>
                        </div>
                    </Dialog.Panel>
                </Modal>
                <Modal
                    isOpen={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
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
                                className="px-2 py-1 rounded border border-zinc-900 text-zinc-900 transition-colors hover:bg-zinc-200"
                                onClick={() => setOpenDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-2 py-1 rounded bg-red-600 text-white transition-colors hover:bg-red-700 disabled:bg-red-700"
                                onClick={handleDeleteImage}
                                disabled={deleteLoading}
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </Modal>
                <ImageModal
                    image={image}
                    isOpen={openImageModal}
                    closeModal={() => setOpenImageModal(false)}
                />
            </TableCellWrapper>
        </>
    );
}
