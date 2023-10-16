"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
};

type ImageCardType = {
    image: ImageType;
    setCurrentImages: Dispatch<SetStateAction<ImageType[]>>;
};

export default function ImageCard({ image, setCurrentImages }: ImageCardType) {
    const [newName, setNewName] = useState("");

    const deleteImage = async (s3_id: string) => {
        const deleteResponse = await fetch("/api/deleteImage", {
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

    const renameImage = async () => {
        if (!newName) {
            return;
        }

        // TODO call supabase. set new image list
    };

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
            <div>
                <label htmlFor="rename-image">Rename Image</label>
                <input
                    id="rename-image"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={renameImage}>RENAME IMAGE</button>
            </div>
            <button onClick={() => deleteImage(image.s3_id)}>
                DELETE IMAGE
            </button>
        </div>
    );
}
