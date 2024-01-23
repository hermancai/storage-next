import { Metadata } from "next";

export const metadata: Metadata = {
    title: "PhotoSafe - Log In",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
