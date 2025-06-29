"use client";

import { supabase } from "../supabase-client";

function cleanCode(code: string) {
  return code
    .replace(/\r\n/g, "\n")
    .replace(/←/g, "=")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≠/g, "!=");
}

export async function getRandomCodeSnippets() {
  try {
    const { data, error } = await supabase.rpc("get_random_codedata");

    if (error) {
      console.error("Supabase RPC error:", error);
      return null;
    }

    if (data && typeof data[0]?.code === "string") {
      data[0].code = cleanCode(data[0].code);
    }

    return data[0];
  } catch (error) {
    console.error("Unexpected error in getCodeSnippets: ", error);
    return null;
  }
}

export async function getCodeSnippets(language: string, topic: string) {
  try {
    const { data, error } = await supabase.rpc("get_codedata", {
      p_language: language,
      p_topic: topic,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return null;
    }

    if (data && typeof data[0]?.code === "string") {
      data[0].code = cleanCode(data[0].code);
    }

    return data[0];
  } catch (error) {
    console.error("Unexpected error in getCodeSnippets: ", error);
    return null;
  }
}
