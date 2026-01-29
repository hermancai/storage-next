import Link from "next/link";
import Image from "next/image";

export default function LogoHomeLink() {
    return (
        <Link
            href="/"
            className="text-slate-900 flex flex-nowrap gap-1 items-center relative transition-colors hover:bg-zinc-700 rounded-full p-1 w-min"
        >
            <div className="relative h-10 w-10">
                <Image
                    src="/images/logo.svg"
                    alt="logo"
                    fill
                    style={{ objectFit: "contain" }}
                />
            </div>
            <p className="hidden sm:block whitespace-nowrap pr-1 text-white">
                PhotoSafe
            </p>
        </Link>
    );
}
