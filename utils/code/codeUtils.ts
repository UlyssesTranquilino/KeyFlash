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

const LIMIT_COUNT = 5;

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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    // 🔍 Check if user is Pro
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_pro")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { error: "Unable to verify subscription status" };
    }

    const isPro = profile.is_pro;

    // 🚫 Limit enforcement
    if (!isPro) {
      const { count, error: countError } = await supabase
        .from("codes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) {
        return { error: "Could not check code limit" };
      }

      if (count >= LIMIT_COUNT) {
        return { error: "Code limit reached. Upgrade to Pro to add more." };
      }
    }

    // ✅ Insert code
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

    return { data, error: null };
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

export async function getCodesCount() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User not authenticated" };
    }

    const { count, error: countError } = await supabase
      .from("codes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      console.error("Count error:", countError);
      return { error: "Could not check code limit" };
    }

    if (count >= LIMIT_COUNT) {
      return {
        count,
        isLimit: true,
        error: "You’ve reached your code limit. Upgrade to continue.",
      };
    }

    return { count, isLimit: false };
  } catch (error) {
    console.error("Unexpected error counting texts: ", error);
    return { error: "Unexpected error occurred" };
  }
}
