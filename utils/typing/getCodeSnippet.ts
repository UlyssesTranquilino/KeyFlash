"use client";

import { supabase } from "../supabase-client";

export async function getCodeSnippets(language: string, topic: string) {
  try {
    if (language === "any") {
      const { data, error } = await supabase.rpc("get_random_codedata");
      console.log("data: ", data);
      return data;
    }
    // const { data, error } = await supabase.from("solutions").select();

    // console.log("Data: ", data);
  } catch (error) {
    console.error("Unexpected error in getCodeSnippets: ", error);
    return null;
  }
}
