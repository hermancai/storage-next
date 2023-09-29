"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, useEffect, useState } from "react";

export default function HomePage() {
    const supabase = createClientComponentClient();
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [currentFolder, setCurrentFolder] = useState<number>(0);

    // Get user's root folder
    useEffect(() => {
        const getRootFolder = async () => {
            const { data, error } = await supabase
                .from("folder")
                .select("id")
                .filter("parent", "is", "null");
            if (error) {
                return console.log("Fetching root folder failed.");
            }
            setCurrentFolder(data[0]["id"]);
        };
        getRootFolder();
    }, []);

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
        const { error } = await supabase.from("image").insert({
            s3_id: urlResponse.s3_id,
            name: fileToUpload.name,
            folder: currentFolder,
        });
        if (error) {
            console.log(error);
        }
    };

    const handleFileSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
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
                    id="image-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileSubmit(e)}
                />
            </div>
            <button onClick={uploadImage}>Request upload URL</button>
        </div>
    );
}
