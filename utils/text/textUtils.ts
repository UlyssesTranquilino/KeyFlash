"use client";

import { createClient } from "../supabase/client";

type textType = {
  id: string | number;
  title: string;
  text: string;
};

export async function insertText(textData: textType) {
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
      .from("texts")
      .insert([
        {
          user_id: user.id,
          title: textData.title,
          texts: textData.text,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error inserting text:", error);
    return { error: "Unexpected error occurred" };
  }
}
