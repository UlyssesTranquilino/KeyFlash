"use client";

import { createClient } from "../supabase/client";

export async function upgradeUserToPro() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authenticated:", authError);
      return { error: "User not authenticated" };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_pro: true })
      .eq("id", user.id)
      .single();

    if (updateError) {
      console.error("Failed to upgrade user to pro:", updateError);
      return { error: updateError.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error upgrading user:", err);
    return { error: "Unexpected error occurred" };
  }
}
