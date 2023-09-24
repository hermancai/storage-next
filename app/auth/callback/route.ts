import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// redirect user after email confirmation
export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const code = reqUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    // create root folder for new user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session !== null) {
      await supabase.from("folder").insert({ name: "Root", parent: null });
    }
  }

  // take user back to landing page
  return NextResponse.redirect(reqUrl.origin);
}
