// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(
          `${origin}/auth/login?error=Authentication failed`
        );
      }

      // Successful authentication - redirect to home or dashboard
      return NextResponse.redirect(`${origin}/home`);
    } catch (error) {
      console.error("Unexpected error during OAuth callback:", error);
      return NextResponse.redirect(
        `${origin}/auth/login?error=Authentication failed`
      );
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(
    `${origin}/auth/login?error=No authorization code received`
  );
}
