import { supabase } from "../../../utils/supabase-client";
import { createClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supaase = createClient();

  return <>{children}</>;
}
