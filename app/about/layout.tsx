import { Metadata } from "next";

export const metadata: Metadata = {
    title: "PhotoSafe - About",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
