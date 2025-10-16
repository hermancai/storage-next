import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="flex flex-col items-center py-10 sm:py-16 px-4 sm:px-8 bg-zinc-800 h-full">
            <div className="flex flex-col max-w-lg gap-4 text-zinc-100">
                <h1 className="text-3xl">Thanks for visiting!</h1>
                <p>
                    This is a test site I made for learning Next.js, PostgreSQL,
                    and AWS.
                </p>
                <Link
                    href="/"
                    className="shadow px-2 py-1 rounded border border-zinc-100 text-zinc-100 bg-zinc-900 transition-colors hover:bg-zinc-700 whitespace-nowrap w-min"
                >
                    Back to Home
                </Link>
            </div>
            <div className="mt-1 relative max-w-lg w-full min-w-[300px] h-[300px]">
                <Image
                    src="/images/upload.svg"
                    alt="upload"
                    fill
                    style={{
                        objectFit: "contain",
                    }}
                    priority={true}
                />
            </div>
        </div>
    );
}
