"use client";

import { createClient } from "../supabase/client";

type termType = {
  id: string | number;
  question: string;
  answer: string;
};

type flashcardDataType = {
  user_id: string | undefined;
  title: string;
  description: string;
  terms: termType[];
  created_at: Date;
};

export async function getAllFlashcards(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching flashcards:", error);
      return { error: error.message };
    }

    return data;
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
