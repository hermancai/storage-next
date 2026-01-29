"use client";

import { ImageWithUrl } from "@/types/api";
import { FolderType } from "@/types/components";
import { useState } from "react";
import ImageUpload from "@/components/home/ImageUpload";
import LayoutIcon from "@/components/home/LayoutIcon";
import FolderCreate from "@/components/home/FolderCreate";
import FolderCard from "@/components/home/FolderCard";
import ImageCard from "@/components/home/ImageCard";
import CardOptions from "@/components/home/CardOptions";
import FolderNavigation from "@/components/home/FolderNavigation";

interface GalleryProps {
    images: ImageWithUrl[];
    folderId: string;
    folderPath: FolderType[];
    nestedFolders: FolderType[];
}

export default function Gallery({
    images,
    folderPath,
    folderId,
    nestedFolders,
}: GalleryProps) {
    const [nestedFoldersList, setNestedFolders] = useState(nestedFolders);
    const [currentImages, setCurrentImages] = useState(images);
    const [showGrid, setShowGrid] = useState(true);

    return (
        <div className="flex flex-col gap-4 text-zinc-100 pb-3">
            <FolderNavigation folderPath={folderPath} />
            <div className="flex items-center gap-2 justify-between">
                <div className="flex flex-wrap px-2 gap-2">
                    <ImageUpload
                        setCurrentImages={setCurrentImages}
                        currentFolder={folderId}
                    />
                    <FolderCreate
                        currentFolder={folderId}
                        setNestedFolders={setNestedFolders}
                    />
                </div>
                <LayoutIcon showGrid={showGrid} setShowGrid={setShowGrid} />
            </div>

            <div className="px-2 mt-2 flex flex-col gap-2">
                {nestedFoldersList.length === 0 &&
                    currentImages.length === 0 && (
                        <p className="text-lg text-zinc-300">Empty Folder</p>
                    )}
                {nestedFoldersList.length > 0 && (
                    <>
                        <h3 className="text-sm underline">
                            Folders ({nestedFoldersList.length})
                        </h3>
                        {showGrid ? (
                            <div className="gap-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                                {nestedFoldersList.map((folder) => {
                                    return (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            setNestedFolders={setNestedFolders}
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
                                    {nestedFoldersList.map((folder) => {
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
                                            setCurrentImages={setCurrentImages}
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
            </div>
        </div>
    );
}
