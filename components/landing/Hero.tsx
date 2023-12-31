import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <div className="flex justify-center items-center w-full py-4 sm:py-12 px-4 sm:px-8">
            <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 relative p-4 sm:p-8 w-full max-w-5xl">
                <div className="absolute h-[20px] w-[20px] rounded border-slate-700 border-t-4 border-l-4 top-0 left-0" />
                <div className="absolute h-[20px] w-[20px] rounded border-slate-700 border-t-4 border-r-4 top-0 right-0" />
                <div className="absolute h-[20px] w-[20px] rounded border-slate-700 border-b-4 border-r-4 bottom-0 right-0" />
                <div className="absolute h-[20px] w-[20px] rounded border-slate-700 border-b-4 border-l-4 bottom-0 left-0" />
                <div className="flex flex-col min-w-[200px] sm:min-w-[385px] w-full max-w-[400px] gap-4 text-center md:text-left items-center md:items-start">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl text-slate-500">
                        The{" "}
                        <span className="text-slate-700">digital solution</span>{" "}
                        to your{" "}
                        <span className="text-slate-700">
                            photo safekeeping
                        </span>
                    </h1>
                    <div className="flex gap-4">
                        <Link
                            href="/signup"
                            className="shadow border py-2 px-3 rounded whitespace-nowrap flex flex-nowrap gap-2 items-center bg-slate-700 text-white transition-colors hover:bg-slate-900"
                        >
                            Get Started
                        </Link>
                        <button className="shadow py-2 px-3 rounded whitespace-nowrap bg-slate-100 text-slate-900 border border-slate-900 transition-colors hover:bg-slate-300">
                            Guest Demo
                        </button>
                    </div>
                </div>
                <div className="relative min-w-[300px] w-full max-w-lg min-h-[300px] md:h-[300px] top-0 md:-top-8">
                    <Image
                        src="/images/hero.svg"
                        alt="photos"
                        fill
                        style={{ objectFit: "contain" }}
                    />
                </div>
            </div>
        </div>
    );
}
