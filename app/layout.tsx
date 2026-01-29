import Navbar from "@/components/shared/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
    title: "PhotoSafe",
    description: "image cloud storage",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body className="h-full flex flex-col bg-zinc-900">
                <Navbar />
                {children}
                <ToastContainer
                    draggable={false}
                    position="bottom-left"
                    hideProgressBar={true}
                    transition={Slide}
                    theme="light"
                />
            </body>
        </html>
    );
}
