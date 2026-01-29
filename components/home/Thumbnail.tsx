"use client";

import Image from "next/image";
import { ImageType } from "@/types/components";
import { useCallback, useState } from "react";

export default function Thumbnail(image: ImageType) {
    // S3 url for new image fails for first few seconds
    const [retryCount, setRetryCount] = useState(0);
    const [showImage, setShowImage] = useState(false);

    const retryLoad = useCallback(() => {
        if (retryCount > 10) return setShowImage(true);
        setTimeout(() => {
            setRetryCount((prev) => prev + 1);
        }, 1000);
    }, [retryCount]);

    return (
        <div className="w-full h-full relative">
            <Image
                src={image.signedUrl}
                alt={image.name}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
                onError={retryLoad}
                onLoad={() => setShowImage(true)}
            />
            {!showImage && (
                <div className="absolute w-full h-full bg-zinc-800 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-l-zinc-800 border-r-zinc-800 animate-spin" />
                </div>
            )}
        </div>
    );
}
