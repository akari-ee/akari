import { useAuth } from "@clerk/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/types_db";

export function createBrowserClient(token?: Promise<string | null>) {
  return createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_KEY!,
    {
      async accessToken() {
        return token ?? null;
      },
    }
  );
}
