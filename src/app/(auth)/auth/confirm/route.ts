// app/auth/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const origin = requestUrl.origin;

  if (token_hash && type === "signup") {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.verifyOtp({
        type: "signup",
        token_hash,
      });

      if (error) {
        console.error("Email confirmation error:", error);
        return NextResponse.redirect(
          `${origin}/signup?error=Email confirmation failed`
        );
      }

      // Successful confirmation - redirect to home with success message
      return NextResponse.redirect(
        `${origin}/home?message=Email confirmed successfully`
      );
    } catch (error) {
      console.error("Unexpected error during email confirmation:", error);
      return NextResponse.redirect(
        `${origin}/signup?error=Confirmation failed`
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/signup?error=Invalid confirmation link`
  );
}
