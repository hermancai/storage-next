"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
};

export default function HomePage() {
    const supabase = createClientComponentClient();
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [currentFolder, setCurrentFolder] = useState<number>(0);
    const [currentImages, setCurrentImages] = useState<ImageType[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get user's root folder on first page load
    useEffect(() => {
        const getRootFolder = async () => {
            const { data, error } = await supabase
                .from("folder")
                .select("id")
                .filter("parent", "is", "null");
            if (error || data.length === 0) {
                return console.log("Fetching root folder failed.");
            }
            setCurrentFolder(data[0]["id"]);
        };

        getRootFolder();
    }, []);

    // Get images in current folder
    useEffect(() => {
        if (currentFolder === 0) return;

        const getCurrentImages = async () => {
            const getImagesResponse = await fetch("/s3/getImages", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ folderId: currentFolder }),
            });
            const getImagesRes = await getImagesResponse.json();
            if (getImagesRes.error) {
                setCurrentImages([]);
                return console.log(getImagesRes.error);
            }
            setCurrentImages(getImagesRes.images);
        };

        getCurrentImages();
    }, [currentFolder]);

    const uploadImage = async () => {
        if (fileToUpload === null) return;

        // Request presigned URL for upload to s3
        const urlRes = await fetch("/s3/upload", {
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
            return console.log(s3Res);
        }

        // Update supabase
        const insertResponse = await supabase
            .from("image")
            .insert({
                s3_id: urlResponse.s3_id,
                name: fileToUpload.name,
                folder: currentFolder,
            })
            .select("s3_id");
        if (insertResponse.error) {
            return console.log(insertResponse.error);
        }

        // Show image on current page
        const getThumbResponse = await fetch("/s3/getThumb", {
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
            return console.log(getThumbRes.error);
        }

        setCurrentImages([
            ...currentImages,
            {
                s3_id: insertResponse.data[0].s3_id,
                name: fileToUpload.name,
                presignedUrl: getThumbRes.presignedUrl,
            },
        ]);

        // Reset file input
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            return setFileToUpload(e.target.files[0]);
        }
        setFileToUpload(null);
    };

    const deleteImage = async (s3_id: string) => {
        const deleteResponse = await fetch("/s3/deleteImage", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                s3_id,
            }),
        });
        const deleteRes = await deleteResponse.json();
        if (deleteRes.error) {
            return console.log(deleteRes.error);
        }

        setCurrentImages((prevState) =>
            prevState.filter((image) => image.s3_id !== s3_id)
        );
    };

    return (
        <div>
            <p>Home page (logged in)</p>
            <div>Root Folder ID: {currentFolder}</div>
            <div>
                <label htmlFor="image-upload">Choose Image</label>
                <input
                    ref={inputRef}
                    id="image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e)}
                />
            </div>
            <button onClick={uploadImage}>UPLOAD</button>
            <div>
                <p>Images in this folder:</p>
                {currentImages.map((image) => {
                    return (
                        <div key={image.s3_id}>
                            {image.name}
                            <br />
                            {image.s3_id}
                            <br />
                            <Image
                                src={image.presignedUrl}
                                alt={image.name}
                                height={100}
                                width={100}
                            />
                            <button onClick={() => deleteImage(image.s3_id)}>
                                DELETE IMAGE
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
