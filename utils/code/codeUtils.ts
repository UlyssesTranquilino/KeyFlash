"use client";
import { Description } from "@radix-ui/react-dialog";
import { createClient } from "../supabase/client";

type codeDataType = {
  id: string | undefined;
  user_id: string | undefined;
  title: string;
  description: string | undefined;
  code: string;
  difficulty: string;
  space_complexity: string;
  language: string;
  time_complexity: string;
  created_at: Date;
};

export async function getAllCodes() {
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
      .from("codes")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching codes: ", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error getting all codes: ", error);
    return { error: "Unexpected error occcured" };
  }
}

export async function getCode(codeId: string) {
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
      .from("codes")
      .select("*")
      .eq("id", codeId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching code: ", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error getting all codes: ", error);
    return { error: "Unexpected error occcured" };
  }
}

export async function insertCode(codeData: codeDataType) {
  try {
    const supabase = createClient();
    console.log(codeData);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      return { error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("codes")
      .insert([
        {
          user_id: user.id,
          title: codeData.title,
          description: codeData.description,
          code: codeData.code,
          language: codeData.language,
          created_at: codeData.created_at.toISOString(),
          difficulty: codeData.difficulty,
          time_complexity: codeData.time_complexity,
          space_complexity: codeData.space_complexity,
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
    console.error("Unexpected error inserting code:", error);
    return { error: "Unexpected error occurred" };
  }
}

export async function editCode(codeData: codeDataType) {
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
      .from("codes")
      .update({
        title: codeData.title,
        language: codeData.language,
        description: codeData.description,
        code: codeData.code,
        time_complexity: codeData.time_complexity,
        space_complexity: codeData.space_complexity,
      })
      .select("*")
      .eq("id", codeData.id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error editing code: ", error);
      return { error: error.message };
    }

    return data;
  } catch (error) {
    console.error("Unexpected error getting all codes: ", error);
    return { error: "Unexpected error occcured" };
  }
}

export async function deleteCode(codeId: string) {
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
      .from("codes")
      .delete()
      .eq("id", codeId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error: ", error);
      return { error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error deleting code:", error);
    return { error: "Unexpected error occurred" };
  }
}
