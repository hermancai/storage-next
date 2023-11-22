"use client";

import FolderCard from "@/components/home/FolderCard";
import FolderCreate from "@/components/home/FolderCreate";
import ImageCard from "@/components/home/ImageCard";
import ImageUpload from "@/components/home/ImageUpload";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import FolderNavigation from "@/components/home/FolderNavigation";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
};

type FolderType = {
    name: string;
    id: string;
    parent?: string | null;
};

export default function FolderPage({ params }: { params: { id: string } }) {
    const supabase = createClientComponentClient();

    const [folderPath, setFolderPath] = useState<FolderType[]>([]);
    const [nestedFolders, setNestedFolders] = useState<FolderType[]>([]);
    const [currentImages, setCurrentImages] = useState<ImageType[]>([]);

    // Get folder hierarchy on page load
    useEffect(() => {
        const getFolderPath = async () => {
            const { data, error } = await supabase.rpc("get_folder_path", {
                f_id: params.id,
            });
            if (error) {
                return console.log(error);
            }
            setFolderPath(data);
        };

        getFolderPath();
    }, [supabase, params.id]);

    // Get images in current folder
    useEffect(() => {
        if (folderPath.length === 0) return;

        const getCurrentImages = async () => {
            // Need to go to server instead of directly to subapase
            // because server creates presigned urls
            const getImagesResponse = await fetch("/api/getImages", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ folderId: folderPath[0].id }),
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
                .eq("parent", folderPath[0].id);
            if (getFoldersResponse.error) {
                return console.log(getFoldersResponse.error);
            }
            setNestedFolders(getFoldersResponse.data);
        };

        getCurrentImages();
        getNestedFolders();
    }, [folderPath, supabase]);

    if (folderPath.length === 0) {
        return <div>LOADING</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <FolderNavigation folderPath={folderPath} />
            <div className="flex px-2 gap-2">
                <ImageUpload
                    setCurrentImages={setCurrentImages}
                    currentFolder={folderPath[0].id}
                />
                <FolderCreate
                    currentFolder={folderPath[0].id}
                    setNestedFolders={setNestedFolders}
                />
                <br />
            </div>

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
