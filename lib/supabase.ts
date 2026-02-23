import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isMockMode = !supabaseUrl || !supabaseKey;

export function getSupabaseBrowserClient() {
  if (isMockMode) return null;
  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
