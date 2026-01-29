"use client";

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "react-toastify";
import SuccessToast from "@/components/shared/SuccessToast";
import ErrorToast from "@/components/shared/ErrorToast";
import { ImageType } from "@/types/components";
import getPresignedUrl from "@/lib/actions/getPresignedUrl";
import getThumbnail from "@/lib/actions/getThumbnail";
import { uploadToS3 } from "@/lib/client/uploadToS3";
import addImageToSubabase from "@/lib/client/addImageToSupabase";

type ImageUploadType = {
    setCurrentImages: Dispatch<SetStateAction<ImageType[]>>;
    currentFolder: string;
};

export default function ImageUpload({
    setCurrentImages,
    currentFolder,
}: ImageUploadType) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const resetInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setLoading(false);
    };

    const showErrorToast = (err: string | Response) => {
        resetInput();
        toast(<ErrorToast message="Upload failed." />);
        console.log(err);
        return;
    };

    const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const fileToUpload = e.target.files[0];
        setLoading(true);

        const presignRes = await getPresignedUrl(fileToUpload.name);
        if (!presignRes.ok) return showErrorToast(presignRes.error);

        const uploadRes = await uploadToS3(presignRes, fileToUpload);
        if (!uploadRes.ok) return showErrorToast(uploadRes);

        const supabaseRes = await addImageToSubabase(
            presignRes.s3_id,
            fileToUpload.name,
            currentFolder
        );
        if (!supabaseRes.ok) return showErrorToast(supabaseRes.error);

        const thumbnailRes = await getThumbnail(
            supabaseRes.s3_id,
            fileToUpload.name
        );
        if (!thumbnailRes.ok) return showErrorToast(thumbnailRes.error);

        setCurrentImages((prevState) => {
            return [
                {
                    s3_id: supabaseRes.s3_id,
                    name: fileToUpload.name,
                    signedUrl: thumbnailRes.signedUrl,
                    created_at: supabaseRes.created_at,
                },
                ...prevState,
            ];
        });

        resetInput();
        toast(<SuccessToast message="Photo uploaded." />);
    };

    return (
        <div>
            <button
                className="rounded flex flex-nowrap items-center whitespace-nowrap gap-2 px-2 py-1 text-zinc-900 border border-zinc-900 bg-zinc-100 transition-colors hover:bg-zinc-300"
                onClick={handleButtonClick}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-700 border-t-2 border-b-2 border-t-white border-b-white animate-spin rounded-full" />
                ) : (
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.3"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                    </div>
                )}
                Upload
            </button>
            <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => uploadImage(e)}
                className="hidden"
            />
        </div>
    );
}
