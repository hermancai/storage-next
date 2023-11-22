"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "react-toastify";
import SuccessToast from "../shared/SuccessToast";
import ErrorToast from "../shared/ErrorToast";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
};

type ImageUploadType = {
    setCurrentImages: Dispatch<SetStateAction<ImageType[]>>;
    currentFolder: string;
};

export default function ImageUpload({
    setCurrentImages,
    currentFolder,
}: ImageUploadType) {
    const supabase = createClientComponentClient();

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

    const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;
        const fileToUpload = e.target.files[0];
        setLoading(true);

        // Request presigned URL for upload to s3
        const urlRes = await fetch("/api/uploadImage", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileType: fileToUpload.name.split(".").pop(),
            }),
        });
        const urlResponse = await urlRes.json();
        if (urlResponse.error) {
            resetInput();
            toast(<ErrorToast message="Upload failed." />);
            return console.log(urlResponse.error);
        }

        // Upload to s3
        const formData = new FormData();
        Object.keys(urlResponse.fields).forEach((key) => {
            formData.append(key, urlResponse.fields[key]);
        });
        formData.append("file", fileToUpload);
        const s3Res = await fetch(urlResponse.url, {
            method: "POST",
            body: formData,
        });
        if (!s3Res.ok) {
            resetInput();
            toast(<ErrorToast message="Upload failed." />);
            return console.log(s3Res);
        }

        // Update supabase
        const insertResponse = await supabase
            .from("image")
            .insert({
                s3_id: urlResponse.s3_id,
                name: fileToUpload.name,
                folder_id: currentFolder,
            })
            .select("s3_id");
        if (insertResponse.error) {
            resetInput();
            toast(<ErrorToast message="Upload failed." />);
            return console.log(insertResponse.error);
        }

        // Show image on current page
        const getThumbResponse = await fetch("/api/getThumb", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                s3_id: insertResponse.data[0].s3_id,
                name: fileToUpload.name,
            }),
        });
        const getThumbRes = await getThumbResponse.json();
        if (getThumbRes.error) {
            resetInput();
            toast(<ErrorToast message="Upload failed." />);
            return console.log(getThumbRes.error);
        }

        setCurrentImages((prevState) => {
            return [
                ...prevState,
                {
                    s3_id: insertResponse.data[0].s3_id,
                    name: fileToUpload.name,
                    presignedUrl: getThumbRes.presignedUrl,
                },
            ];
        });

        resetInput();
        toast(<SuccessToast message="Photo uploaded." />);
    };

    return (
        <div>
            <button
                className="rounded flex flex-nowrap items-center whitespace-nowrap gap-2 px-2 py-1 text-white bg-slate-700 transition-colors hover:bg-slate-900"
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
