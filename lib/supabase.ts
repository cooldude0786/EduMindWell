import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
const supabaseServiceKey = (
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
)?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables in .env (SUPABASE_URL and SUPABASE_SECRET_KEY)");
}

if (supabaseServiceKey.startsWith("sb_publish") || supabaseServiceKey.startsWith("sb_publishable")) {
  throw new Error(
    "Supabase publishable key detected. Configure SUPABASE_SECRET_KEY with the sb_secret_... key for server-side Storage uploads.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
