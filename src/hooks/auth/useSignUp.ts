import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { capitalize } from "@/lib/capitalize";

/**
 * Custom hook for handling user signup actions.
 *
 * Provides functions to sign up with email/password or with OAuth providers.
 * You can optionally specify a redirect URL on success.
 *
 * @param options - Optional config such as redirect path
 */
export function useSignUp(options?: { redirect?: string }) {
  const router = useRouter();
  const redirectPath = options?.redirect ?? "/signin";

  /**
   * Sign up a new user using email and password.
   * Shows a toast and redirects on success.
   *
   * @param credentials - Email and password
   */
  const signUpWithEmail = useCallback(
    async (credentials: SignUpWithPasswordCredentials) => {
      try {
        const { error } = await supabase.auth.signUp(credentials);

        if (error) {
          console.error("Sign-up error:", error);
          toast.error("Failed to sign up. Please try again later.");
          return;
        }

        toast.success("Confirmation email sent! Please check your inbox.");
        router.push(redirectPath);
      } catch (e) {
        console.error("Unexpected sign-up error:", e);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    },
    [router, redirectPath]
  );

  /**
   * Sign up via OAuth provider (e.g., Google, GitHub, Discord).
   *
   * @param provider - The OAuth provider to use
   */
  const signUpWithOAuth = useCallback(
    async (provider: "google" | "github" | "discord", redirectTo?: string) => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: redirectTo ? { redirectTo } : undefined,
        });

        if (error) {
          console.error(`OAuth sign-up error (${provider}):`, error);
          toast.error(
            `Failed to sign up with ${capitalize(provider)}. Please try again.`
          );
        }
      } catch (e) {
        console.error("Unexpected OAuth sign-up error:", e);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    },
    []
  );

  return {
    signUpWithEmail,
    signUpWithOAuth,
  };
}
