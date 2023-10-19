"use client";

import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type FolderType = {
    name: string;
    id: string;
};

type FolderCardType = {
    folder: FolderType;
    setNestedFolders: Dispatch<SetStateAction<FolderType[]>>;
};

export default function FolderCard({
    folder,
    setNestedFolders,
}: FolderCardType) {
    const deleteFolder = async () => {
        const response = await fetch("/api/deleteFolder", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: folder.id }),
        });
        const res = await response.json();
        if (res.error) {
            return console.log(res.error);
        }

        setNestedFolders((prevState) =>
            prevState.filter((entry) => entry.id !== folder.id)
        );
    };

    return (
        <div>
            <Link href={`/home/folder/${folder.id}`}>{folder.name}</Link>
            <button onClick={deleteFolder}>DELETE FOLDER</button>
        </div>
    );
}
