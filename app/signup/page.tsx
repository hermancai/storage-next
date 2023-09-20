"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // redirect user after verifying email
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    router.refresh();
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleSignUp}>Sign Up</button>
      </form>
    </div>
  );
}
