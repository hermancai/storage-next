"use client";

import Link from "next/link";
import {
  createClientComponentClient,
  Session,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center">
      <Link href="/">Home</Link>
      <div className="flex gap-4">
        {session !== null ? (
          <>
            <p>Hello, {session.user.email}</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/signup">Sign Up</Link>
            <Link href="/login">Log In</Link>
          </>
        )}
      </div>
    </div>
  );
}
