import { Metadata } from "next";

export const metadata: Metadata = {
    title: "PhotoSafe - Sign Up",
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
