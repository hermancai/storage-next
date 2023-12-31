import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="flex flex-col justify-center items-center py-10 sm:py-16 px-4 sm:px-8">
            <div className="flex flex-col max-w-lg gap-4">
                <h1 className="text-3xl">Thanks for visiting!</h1>
                <p className="text-slate-700">
                    This site was built for learning and demonstrative purposes.
                    This means that while account creation and uploading are
                    free and functional, other features are merely visual or in
                    progress. This site is also subject to shutting down
                    anytime.
                </p>
                <Link
                    href="/"
                    className="shadow px-2 py-1 rounded text-white bg-slate-700 transition-colors hover:bg-slate-900 whitespace-nowrap w-min"
                >
                    Back to Home
                </Link>
            </div>
            <div className="relative max-w-lg w-full min-w-[300px] h-[300px]">
                <Image
                    src="/images/upload.svg"
                    alt="upload"
                    fill
                    style={{
                        objectFit: "contain",
                    }}
                />
            </div>
        </div>
    );
}
