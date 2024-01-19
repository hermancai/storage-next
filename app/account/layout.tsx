import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const guestEmail = process.env.NEXT_PUBLIC_GUEST_EMAIL;
    const supabase = createServerComponentClient({ cookies });

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
