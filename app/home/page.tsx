"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/home/ImageUpload";
import ImageCard from "@/components/home/ImageCard";
import FolderCard from "@/components/home/FolderCard";
import FolderCreate from "@/components/home/FolderCreate";
import useRedirectIfUnauthorized from "@/hooks/useRedirectIfUnauthorized";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
};

type FolderType = {
    name: string;
    id: string;
};

export default function HomePage() {
    const [loading, setLoading] = useState(true);
    useRedirectIfUnauthorized(setLoading);
    const supabase = createClientComponentClient();

    const [currentFolder, setCurrentFolder] = useState("");
    const [nestedFolders, setNestedFolders] = useState<FolderType[]>([]);
    const [currentImages, setCurrentImages] = useState<ImageType[]>([]);

    // Get user's root folder on first page load
    useEffect(() => {
        const getRootFolder = async () => {
            const { data, error } = await supabase
                .from("folder")
                .select("id")
                .filter("parent", "is", "null");
            if (error || data.length === 0) {
                return;
            }
            setCurrentFolder(data[0]["id"]);
        };
        getRootFolder();
    }, [supabase]);

    // Get images in current folder
    useEffect(() => {
        if (!currentFolder) return;

        const getCurrentImages = async () => {
            // Need to go to server instead of directly to subapase
            // because server creates presigned urls
            const getImagesResponse = await fetch("/api/getImages", {
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

        const getNestedFolders = async () => {
            const getFoldersResponse = await supabase
                .from("folder")
                .select("name, id")
                .eq("parent", currentFolder);
            if (getFoldersResponse.error) {
                return console.log(getFoldersResponse.error);
            }
            setNestedFolders(getFoldersResponse.data);
        };

        getCurrentImages();
        getNestedFolders();
    }, [currentFolder, supabase]);

    if (loading) {
        return <div>LOADING</div>;
    }

    return (
        <div>
            <div>Root Folder ID: {currentFolder}</div>
            <br />

            <FolderCreate
                currentFolder={currentFolder}
                setNestedFolders={setNestedFolders}
            />
            <br />

            <div>
                <p>Nested folders: {nestedFolders.length}</p>
                {nestedFolders.map((folder) => {
                    return (
                        <FolderCard
                            key={folder.id}
                            folder={folder}
                            setNestedFolders={setNestedFolders}
                        />
                    );
                })}
            </div>
            <br />

            <ImageUpload
                setCurrentImages={setCurrentImages}
                currentFolder={currentFolder}
            />
            <br />

            <div>
                <p>Images in this folder: {currentImages.length}</p>
                {currentImages.map((image) => {
                    return (
                        <ImageCard
                            key={image.s3_id}
                            image={image}
                            setCurrentImages={setCurrentImages}
                        />
                    );
                })}
            </div>
        </div>
    );
}
