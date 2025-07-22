import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { capitalize } from "@/lib/capitalize";

/**
 * Custom hook for handling user signin actions.
 *
 * Provides functions to sign in with email/password or with OAuth providers.
 * You can optionally specify a redirect URL on success.
 *
 * @param options - Optional config such as redirect path
 */
export function useSignIn(options?: { redirect?: string }) {
  const router = useRouter();
  const redirectPath = options?.redirect ?? "/";

  /**
   * Sign in a user using email and password.
   * Shows a toast and redirects on success.
   *
   * @param credentials - Email and password
   */
  const signInWithEmail = useCallback(
    async (credentials: SignInWithPasswordCredentials) => {
      try {
        const { error } = await supabase.auth.signInWithPassword(credentials);

        if (error) {
          console.error("Sign-in error:", error);
          toast.error("Incorrect email or password. Please try again.");
          return;
        }

        toast.success("Signed in successfully!");
        router.push(redirectPath);
      } catch (e) {
        console.error("Unexpected sign-in error:", e);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    },
    [router, redirectPath]
  );

  /**
   * Sign in via OAuth provider (e.g., Google, GitHub, Discord).
   *
   * @param provider - The OAuth provider to use
   */
  const signInWithOAuth = useCallback(
    async (provider: "google" | "github" | "discord", redirectTo?: string) => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: redirectTo ? { redirectTo } : undefined,
        });

        if (error) {
          console.error(`OAuth sign-ip error (${provider}):`, error);
          toast.error(
            `Failed to sign in with ${capitalize(provider)}. Please try again.`
          );
        }
      } catch (e) {
        console.error("Unexpected OAuth sign-in error:", e);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    },
    []
  );

  return {
    signInWithEmail,
    signInWithOAuth,
  };
}
