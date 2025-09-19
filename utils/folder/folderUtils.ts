import { createClient } from "../supabase/client";

interface CreateFolderProps {
  userId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export async function getAllFolders(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error getting folders:", error);
    return [];
  }

  return data || [];
}

export async function createFolder({
  userId,
  name,
  description,
  color = "#3B82F6", // default blue
  icon,
}: CreateFolderProps) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("folders")
    .insert([
      {
        user_id: userId,
        name,
        description: description || null,
        color,
        icon: icon || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating folder:", error);
    return { error };
  }

  return { data };
}
