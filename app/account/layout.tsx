export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { redirect } from "next/navigation";
import isGuest from "@/lib/server/isGuest";

export const metadata: Metadata = {
    title: "PhotoSafe - Account",
};

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Prevent accout management if guest
    if (await isGuest()) {
        redirect("/home");
    }

    return <>{children}</>;
}
