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

export async function editUserProfile(newUserData: any) {
  try {
    const supabase = createClient();
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      return { error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: newUserData.name,
        nickname: newUserData.nickname,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error inserting flashcard:", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function deleteFlashcard(flashcardId: string) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      return { error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", flashcardId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error: ", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error deleting flashcard:", error);
    return { error: "Unexpected error occurred" };
  }
}
