"use client";

import { createClient } from "../supabase/client";

type termType = {
  id: string | number;
  question: string;
  answer: string;
};

type flashcardDataType = {
  id: string;
  user_id: string | undefined;
  title: string;
  description: string;
  terms: termType[];
  created_at: Date;
};

const LIMIT_COUNT = 5;

export async function getAllFlashcards(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching flashcards: ", error);
      return { error: error.message };
    }

    return data;
  } catch (error) {
    console.error("Unexpected error getting all flashcards: ", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function editFlashcard(flashcardData: flashcardDataType) {
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
      .from("flashcards")
      .update({
        title: flashcardData.title,
        description: flashcardData.description,
        terms: flashcardData.terms,
      })
      .eq("id", flashcardData.id)
      .eq("user_id", user.id)
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

export async function getFlashcard(userId: string, flashcardId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", userId)
      .eq("id", flashcardId)
      .single();

    if (error) {
      console.error("Error fetching flashcard:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error fetching flashcard:", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function insertFlashcard(flashcardData: flashcardDataType) {
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
      .from("flashcards")
      .insert([
        {
          user_id: flashcardData.user_id,
          title: flashcardData.title,
          description: flashcardData.description,
          created_at: flashcardData.created_at,
          terms: flashcardData.terms,
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

export async function getFlashcardsCount() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    // 🔁 Fetch user's profile to double-check is_pro status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return { error: "Could not verify Pro status" };
    }

    // ✅ If user is Pro, skip count check
    if (profile.is_pro) {
      return { count: 0, isLimit: false };
    }

    const { count, error: countError } = await supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Count error:", countError);
      return { error: "Could not check flashcard limit" };
    }

    if (count >= LIMIT_COUNT) {
      return {
        count,
        isLimit: true,
        error: "You’ve reached your flashcard limit. Upgrade to continue.",
      };
    }

    return { count, isLimit: false };
  } catch (error) {
    console.error("Unexpected error counting flashcards:", error);
    return { error: "Unexpected error occurred" };
  }
}
