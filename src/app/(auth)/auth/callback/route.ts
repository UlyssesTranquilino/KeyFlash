// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const FREE_PRO_LIMIT = 50;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const errorParam = requestUrl.searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=No authorization code received`
    );
  }

  const supabase = createClient();

  try {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("OAuth callback error:", exchangeError);
      return NextResponse.redirect(
        `${siteUrl}/login?error=Authentication failed`
      );
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found after authentication");

    // Ensure user exists in profiles table
    const { data: publicUser } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const primaryIdentity = user.identities?.[0];
    if (!primaryIdentity) throw new Error("No identity found");

    const profileData = {
      id: user.id,
      email: user.email,
      avatar_url:
        primaryIdentity.identity_data?.avatar_url ||
        user.user_metadata?.avatar_url,
      full_name:
        primaryIdentity.identity_data?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0],
      created_at: new Date().toISOString(),
      is_pro: false,
    };

    const { data: proUsers, error: countError } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("is_pro", true);

    if (countError) console.error("Error counting Pro users: ", countError);

    if (!publicUser) {
      if ((proUsers?.length ?? 0) < FREE_PRO_LIMIT) {
        profileData.is_pro = true;
      }

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });

      if (upsertError) console.error("Profile creation failed:", upsertError);
    }

    return NextResponse.redirect(`${siteUrl}/dashboard`);
  } catch (err) {
    console.error("Unexpected error during OAuth callback:", err);
    return NextResponse.redirect(
      `${siteUrl}/login?error=Authentication failed`
    );
  }
}
