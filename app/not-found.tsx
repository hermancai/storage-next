import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-full flex flex-col items-center bg-zinc-800 text-zinc-100 py-12 gap-4">
            <div className="flex items-baseline gap-4">
                <h1 className="text-3xl">404</h1>
                <p>Page not found</p>
            </div>
            <Link
                href="/"
                className="py-1 px-2 rounded bg-zinc-100 text-zinc-900 hover:bg-zinc-300 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
