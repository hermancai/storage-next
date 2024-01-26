"use client";

import type { ImageType } from "@/custom-types";

type ThumbnailType = {
    image: ImageType;
};

import Image from "next/image";
import { useCallback, useState } from "react";

export default function Thumbnail({ image }: ThumbnailType) {
    // S3 url for new images fails on first load
    const [retryCount, setRetryCount] = useState(0);
    const [showImage, setShowImage] = useState(false);

    const retryLoad = useCallback(() => {
        if (retryCount > 5) return setShowImage(true);
        setTimeout(() => {
            setRetryCount((prev) => prev + 1);
        }, 1000);
    }, [retryCount]);

    return (
        <div className="w-full h-full relative">
            <Image
                src={image.presignedUrl}
                alt={image.name}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
                onError={retryLoad}
                onLoad={() => setShowImage(true)}
            />
            <span
                className={`absolute w-full h-full bg-zinc-800 ${
                    showImage ? "hidden" : ""
                }`}
            />
        </div>
    );
}
