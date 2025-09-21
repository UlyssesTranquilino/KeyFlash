import { createClient } from "../supabase/client";

interface CreateFolderProps {
  userId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export async function getFolderById(userId: string, folderId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .eq("id", folderId);

  if (error) {
    console.error("Error getting folder:", error);
    return null;
  }

  return data || null;
}

export async function getAllFolders() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .eq("user_id", user?.id)
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
