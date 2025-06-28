"use client";

import { supabase } from "../supabase-client";

export async function getCodeSnippets(language: string, topic: string) {
  try {
    if (language === "any") {
      const { data, error } = await supabase.rpc("get_random_codedata");

      if (error) {
        console.error("Supabase RPC error:", error);
        return null;
      }

      // Format the `code` field
      if (data && typeof data.code === "string") {
        data.code = data.code.replace(/\\n/g, "\n").replace(/\\r/g, "");
      }

      console.log("Data to pass: ", data[0]);
      return data[0];
    }

    // Add other branches if needed
  } catch (error) {
    console.error("Unexpected error in getCodeSnippets: ", error);
    return null;
  }
}
