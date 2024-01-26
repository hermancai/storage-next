import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "PhotoSafe - Account",
};

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL;

    const cookieStore = cookies();
    const supabase = createServerComponentClient({
        cookies: () => cookieStore,
    });

    const checkGuestUser = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) return false;

        if (data?.session?.user.email === guestEmail) return true;
        return false;
    };

    if (await checkGuestUser()) {
        redirect("/home");
    }

    return <>{children}</>;
}
