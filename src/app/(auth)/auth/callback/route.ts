// app/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const error = requestUrl.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}`
    )
  }

  if (!code) {
        return NextResponse.redirect(
      `${origin}/login?error=No authorization code received`
    );
  }

  if (code) {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(
          `${origin}/login?error=Authentication failed`
        );
      }

      // Get the authenticated user
      const { data: {user}} = await supabase.auth.getUser();
      if (!user) throw new Error("User not found after authentication")

      // Ensure user exists in public.profiles table
      const { data: publicUser, error: lookupError} = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const primaryIdentity = user.identities?.[1] || user.identities?.[0];
    if (!primaryIdentity) {
      throw new Error("No identity found");
    }

    
    // Prepare profile data
    const profileData = {
      id: user.id,
      email: user.email,
      avatar_url: primaryIdentity.identity_data?.avatar_url || 
                user.user_metadata?.avatar_url,
      full_name: primaryIdentity.identity_data?.full_name ||
               user.user_metadata?.full_name ||
               user.email?.split("@")[0],
      created_at: new Date().toISOString()
    };



    if (!publicUser) {
      // Create profile using the selected identity data
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error("Profile creation failed:", upsertError);
      }
    }


      return NextResponse.redirect(`${origin}/dashboard`);
      
    } catch (error) {
      console.error("Unexpected error during OAuth callback:", error);
      return NextResponse.redirect(
        `${origin}/login?error=Authentication failed`
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=No authorization code received`
  );
}
