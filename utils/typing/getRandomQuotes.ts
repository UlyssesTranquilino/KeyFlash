"use client";

import { supabase } from "../supabase-client";

export async function getRandomQuotes() {
  try {
    const { data, error } = await supabase.rpc("get_random_quote");

    if (error) {
      console.error("Error fetching random quote via RPC:", error);
      // Handle error appropriately
      return null; // Return null or throw the error
    } else {
      // rpc returns an array, even if limit is 1, so take the first element
      const randomQuote = data && data.length > 0 ? data[0] : null;

      return randomQuote; // Return the single random quote object
    }
  } catch (error) {
    console.error("Unexpected error in getRandomQuotes: ", error);
    return null; // Ensure a return even on unexpected errors
  }
}
