"use client";

import FolderCard from "@/components/home/FolderCard";
import FolderCreate from "@/components/home/FolderCreate";
import ImageCard from "@/components/home/ImageCard";
import ImageUpload from "@/components/home/ImageUpload";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import FolderNavigation from "@/components/home/FolderNavigation";
import LayoutIcon from "@/components/home/LayoutIcon";
import CardOptions from "@/components/home/CardOptions";

type ImageType = {
    s3_id: string;
    name: string;
    presignedUrl: string;
    created_at: string;
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
    const [showGrid, setShowGrid] = useState(false);
    const [loadingCurrentFolder, setLoadingCurrentFolder] = useState(true);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [loadingImages, setLoadingImages] = useState(true);

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
            setLoadingCurrentFolder(false);
        };

        getFolderPath();
    }, [supabase, params.id]);

    // Get images in current folder
    useEffect(() => {
        if (folderPath.length === 0) return;

        const getCurrentImages = async () => {
            // Need to go to server instead of directly to supabase
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
            setLoadingImages(false);
        };

        const getNestedFolders = async () => {
            const getFoldersResponse = await supabase
                .from("folder")
                .select("name, id")
                .eq("parent", folderPath[0].id)
                .order("name");
            if (getFoldersResponse.error) {
                return console.log(getFoldersResponse.error);
            }
            setNestedFolders(getFoldersResponse.data);
            setLoadingFolders(false);
        };

        getCurrentImages();
        getNestedFolders();
    }, [folderPath, supabase]);

    return (
        <div className="flex flex-col gap-4">
            {loadingCurrentFolder ? null : (
                <>
                    <FolderNavigation folderPath={folderPath} />
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex flex-wrap px-2 gap-2">
                            <ImageUpload
                                setCurrentImages={setCurrentImages}
                                currentFolder={folderPath[0].id}
                            />
                            <FolderCreate
                                currentFolder={folderPath[0].id}
                                setNestedFolders={setNestedFolders}
                            />
                        </div>
                        <LayoutIcon
                            showGrid={showGrid}
                            setShowGrid={setShowGrid}
                        />
                    </div>
                </>
            )}

            <div className="px-2 mt-2 flex flex-col gap-2">
                {loadingFolders || loadingImages ? (
                    <div className="w-6 h-6 border-2 border-white border-t-slate-700 border-b-slate-700 rounded-full animate-spin" />
                ) : (
                    <>
                        {nestedFolders.length === 0 &&
                            currentImages.length === 0 && (
                                <p className="text-lg text-slate-500">
                                    Empty Folder
                                </p>
                            )}
                        {nestedFolders.length > 0 && (
                            <>
                                <h3 className="text-sm underline">
                                    Folders ({nestedFolders.length})
                                </h3>
                                {showGrid ? (
                                    <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                                        {nestedFolders.map((folder) => {
                                            return (
                                                <FolderCard
                                                    key={folder.id}
                                                    folder={folder}
                                                    setNestedFolders={
                                                        setNestedFolders
                                                    }
                                                    showGrid={showGrid}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <table
                                        className="text-left table-fixed w-full"
                                        cellPadding={0}
                                        cellSpacing={0}
                                    >
                                        <thead>
                                            <tr className="border-b flex">
                                                <th className="font-normal text-sm py-1 grow">
                                                    Name
                                                </th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nestedFolders.map((folder) => {
                                                return (
                                                    <FolderCard
                                                        key={folder.id}
                                                        folder={folder}
                                                        setNestedFolders={
                                                            setNestedFolders
                                                        }
                                                        showGrid={showGrid}
                                                    />
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}

                        {currentImages.length > 0 && (
                            <>
                                <h3 className="text-sm mt-4 underline">
                                    Images ({currentImages.length})
                                </h3>
                                {showGrid ? (
                                    <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                                        {currentImages.map((image) => {
                                            return (
                                                <ImageCard
                                                    key={image.s3_id}
                                                    image={image}
                                                    setCurrentImages={
                                                        setCurrentImages
                                                    }
                                                    showGrid={showGrid}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <table
                                        className="text-left table-fixed w-full"
                                        cellPadding={0}
                                        cellSpacing={0}
                                    >
                                        <thead>
                                            <tr className="border-b flex gap-2">
                                                <th className="font-normal text-sm py-1 grow">
                                                    Name
                                                </th>
                                                <th className="font-normal text-sm py-1 w-[90px]">
                                                    Date Added
                                                </th>
                                                <th>
                                                    <div className="px-1 invisible">
                                                        <CardOptions />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentImages.map((image) => {
                                                return (
                                                    <ImageCard
                                                        key={image.s3_id}
                                                        image={image}
                                                        setCurrentImages={
                                                            setCurrentImages
                                                        }
                                                        showGrid={showGrid}
                                                    />
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
