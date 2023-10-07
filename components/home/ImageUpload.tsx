import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";

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
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            return setFileToUpload(e.target.files[0]);
        }
        setFileToUpload(null);
    };

    const uploadImage = async () => {
        if (fileToUpload === null) return;

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
                folder_id: currentFolder,
            })
            .select("s3_id");
        if (insertResponse.error) {
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

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div>
            <label htmlFor="image-upload">Upload Image</label>
            <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e)}
            />
            <button className="border p-2" onClick={uploadImage}>
                UPLOAD IMAGE
            </button>
        </div>
    );
}
