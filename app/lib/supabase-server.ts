import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/types_db";

export async function createServerClient(token?: Promise<string | null>) {
  return createClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_KEY!,
    {
      async accessToken() {
        return token ?? null;
      },
    }
  );
}
