import { useAuth } from "@clerk/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/types_db";

export function createBrowserClient() {
  const { getToken } = useAuth();

  return createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_KEY!,
    {
      async accessToken() {
        return (await getToken()) ?? null;
      },
    }
  );
}
