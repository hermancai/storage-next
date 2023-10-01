"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type ImageType = {
    s3_id: string;
    name: string;
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
        const getRootImages = async () => {
            const { data, error } = await supabase
                .from("image")
                .select("s3_id, name")
                .eq("folder", currentFolder);
            if (error) {
                return console.log(error);
            }
            setCurrentImages(data);
        };

        getRootImages();
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
            return console.log(s3Res.status);
        }

        // Update supabase
        const { data, error } = await supabase
            .from("image")
            .insert({
                s3_id: urlResponse.s3_id,
                name: fileToUpload.name,
                folder: currentFolder,
            })
            .select("s3_id");
        if (error) {
            return console.log(error);
        }

        // Show image on current page
        setCurrentImages([
            ...currentImages,
            { s3_id: data[0].s3_id, name: fileToUpload.name },
        ]);
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
