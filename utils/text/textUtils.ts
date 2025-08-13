"use client";

import { supabase } from "../supabase-client";
import { createClient } from "../supabase/client";

type textType = {
  id: string | null;
  title: string;
  typingText: string;
};

const LIMIT_COUNT = 5;

export async function getAllTexts() {
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
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching texts: ", error);
      return { error: error.message };
    }

    return data;
  } catch (error) {
    console.error("Unexpected error getting all texts: ", error);
    return { error: "Unexpected error occcured" };
  }
}

export async function getText(textId: string) {
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
      .select("*")
      .eq("user_id", user.id)
      .eq("id", textId)
      .single();

    if (error) {
      console.error("Unexpected error fetching text:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error fetching text:", error);
    return { error: "Unexpected error occurred" };
  }
}

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

    // 🔍 Check Pro status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .single();

    if (profileError || profile === null) {
      console.error("Failed to fetch user profile:", profileError);
      return { error: "Unable to verify subscription status" };
    }

    const isPro = profile.is_pro;

    // 🚫 Limit enforcement for free users
    if (!isPro) {
      const { count, error: countError } = await supabase
        .from("texts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) {
        console.error("Error counting texts:", countError);
        return { error: "Could not check your text limit" };
      }

      if (count >= LIMIT_COUNT) {
        return { error: "Text limit reached. Upgrade to Pro to add more." };
      }
    }

    // ✅ Insert text
    const { data, error } = await supabase
      .from("texts")
      .insert([
        {
          user_id: user.id,
          title: textData.title,
          typingText: textData.typingText,
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

export async function editText(textData: textType) {
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
      .update({
        title: textData.title,
        typingText: textData.typingText,
      })
      .eq("id", textData.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Database error: ", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error inserting flashcard:", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function deleteText(id: string) {
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
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error: ", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error deleting text:", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function getTextsCount() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const { count, error: countError } = await supabase
      .from("texts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Count error:", countError);
      return { error: "Could not check text limit" };
    }

    if (count >= LIMIT_COUNT) {
      return {
        count,
        isLimit: true,
        error: "You’ve reached your text limit. Upgrade to continue.",
      };
    }

    return { count, isLimit: false };
  } catch (error) {
    console.error("Unexpected error counting texts: ", error);
    return { error: "Unexpected error occurred" };
  }
}
