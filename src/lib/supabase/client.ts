import { createBrowserClient } from "@supabase/ssr";

// Get Supabase project credentials from environment variables.
// These should be defined in your .env.local file or deployment environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize and export a Supabase client for use in the browser.
// This client should be used only on the client-side and supports SSR hydration.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
