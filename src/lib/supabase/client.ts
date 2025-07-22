import { createClient } from "@supabase/supabase-js";

// Load Supabase project credentials from environment variables.
// These must be defined in your .env.local or deployment environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize and export a Supabase client for browser-only usage.
// This client automatically parses URL fragments (e.g. #access_token) on page load,
// which is necessary for auth flows like PASSWORD_RECOVERY.
// Avoid using this client on the server side or with SSR — prefer createBrowserClient for that.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
