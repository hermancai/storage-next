"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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

        const newFileName =
            newName +
            image.name.substring(
                image.name.lastIndexOf("."),
                image.name.length
            );

        const supabase = createClientComponentClient();
        const { error } = await supabase
            .from("image")
            .update({ name: newFileName })
            .eq("s3_id", image.s3_id);
        if (error) {
            return console.log(error);
        }

        setNewName("");
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
            <div className="flex flex-col gap-2 items-start">
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
                <button onClick={getFullImage}>DOWNLOAD</button>
                <button onClick={() => deleteImage(image.s3_id)}>
                    DELETE IMAGE
                </button>
            </div>
        </div>
    );
}
